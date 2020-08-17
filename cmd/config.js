
module.exports = {
  dist: 'dist',
  deploy: {
    s3: {
      prefix: null,
      ignoreDirs: [], // 忽略的目錄
      putOptions: {
        ACL: 'public-read',
        // CacheControl: 'max-age=5', // Cache 時間
      }
    }
  }
}
