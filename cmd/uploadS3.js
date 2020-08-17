// node deploy.js --bucket bucket --access access --secret secret

const FileSystem = require('fs');
const Promise = require("promise");
const filterGitignore = true;

let Sep = null;

const scanDir = dir => {
  if (FileSystem.existsSync(dir)) {
    return FileSystem.readdirSync(dir).map(file => {
      if (file !== '.' && file !== '..') {
        if (FileSystem.statSync(dir + file).isDirectory()) {
          return scanDir(dir + file + Sep);
        }
        return [dir + file];
      }
    }).filter(t => t !== null).reduce((a, b) => a.concat(b), []);
  }
  return [];
};


module.exports = (app, closure) => {
  const Mime = require('mime');
  const md5File = require('md5-file');
  const gitignore = app.path.root + '.gitignore';

  // 列出檔案
  const listObjects = (options, closure, items = []) => {
    return app.config.deploy.s3.instance.listObjectsV2(options, (error, data) => {
      if (error) return closure(false);
      const newItems = items.concat(data.Contents.map(t => true && {
        name: t.Key,
        hash: t.ETag.replace(/^('|")(.*)\1/g, '$2')
      }));

      if (data.IsTruncated) {
        listObjects({ ...options, ContinuationToken: data.NextContinuationToken }, closure, newItems);
      } else {
        closure(newItems);
      }
    });
  };

  const queue = new app.Queue();

  // hash files
  queue.enqueue((next) => {
    const localBuildPath = app.path.root + app.config.dist + app.path.$.sep;
    const localFiles = scanDir(localBuildPath)
      .filter(file => !app.config.deploy.s3.ignoreDirs.filter(dir => file.match(dir.local)).length)
      .filter(file => !filterGitignore || file !== gitignore);

    const hashFiles = localFiles.map(file => {
      return {
        name: app.path.$.basename(file),
        hash: md5File.sync(file),
        path: file
      };
    });
    next({ localFiles: hashFiles });
  });

  // get files on s3
  queue.enqueue((next, files) => {
    listObjects({
      Bucket: app.config.deploy.s3.bucket,
      Prefix: app.config.deploy.s3.prefix
    }, s3Files => {
      files.s3Files = s3Files.filter(file => {
        const ignoreDir = app.config.deploy.s3.ignoreDirs;
        if (ignoreDir.length < 1) return true;
        return !ignoreDir.filter(dir => {
          return file.name.match(dir.s3).length;
        });
      });
      next(files);
    });
  });

  // filter files, mapping local and s3 files
  queue.enqueue((next, files) => {
    files.uploadFiles = files.localFiles.filter(localFile => {
      for (let s3File of files.s3Files) {
        if (s3File.name === localFile.name && s3File.hash === localFile.hash) { return false; }
      }
      return true;
    });
    next(files);
  });

  // filter delete file
  queue.enqueue((next, files) => {
    files.deleteFiles = files.s3Files.filter(s3File => {
      for (let localFile of files.localFiles) {
        if (localFile.name === s3File.name) return false;
      }
      return true;
    });
    next(files);
  });

  // upload to s3
  queue.enqueue((next, files) => {
    files.uploadFiles.map(file => {
      return new Promise((resolve, reject) => {
        FileSystem.readFile(file.path, (error, data) => {
          if (error) {
            reject(error);
            return;
          }
          app.config.deploy.s3.instance.putObject({
            Bucket: app.config.deploy.s3.bucket,
            Key: file.name,
            Body: data,
            ContentType: Mime.getType(file.path) || 'text/plain',
            ...app.config.deploy.s3.putOptions
          }, (error, data) => {
            error ? reject(error) : resolve(data);
          });
        });
      });
    });
    next(files);
  });

  // delete s3 files
  queue.enqueue((next, files) => {
    files.deleteFiles.map(file => {
      return new Promise((resolve, reject) => {
        app.config.deploy.s3.instance.deleteObject({
          Bucket: app.config.deploy.s3.bucket,
          Key: file.name
        }, (error, data) => {
          error ? reject(error) : resolve(data);
        });
      });
    });
    closure(true);
  });
};

