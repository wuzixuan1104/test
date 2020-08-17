const app = require('./app');
const getArgv = require('./argv');
const S3 = require('aws-sdk/clients/s3');

const bucket = getArgv(['-B', '--bucket']);
const access = getArgv(['-A', '--access']);
const secret = getArgv(['-S', '--secret']);

app.config.deploy = {
  ...app.config.deploy,
  s3: {
    ...app.config.deploy.s3,
    bucket,
    access,
    secret,
    instance: new S3({
      accessKeyId: access,
      secretAccessKey: secret
    })
  }
};

app.config.deploy.s3.instance.listBuckets((error, data) => {
  if (error) {
    console.log('Bucket error: ', error);
  }
  if (data.Buckets.map(t => t.Name).indexOf(app.config.deploy.s3.bucket) === -1) {
    console.log('這組 bucket 不合法！');
  }
});

const finish = (resp) => {
  if (resp) console.log('upload to s3 !!! SUCCESS !!!');
  else console.log('upload to s3 !!! FAIL !!!');
};

const uploadS3Path = app.path.cmd + 'uploadS3';
const deployS3 = require(uploadS3Path);

deployS3(app, () => finish());

