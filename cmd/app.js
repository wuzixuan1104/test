const Queue = require('./queue');
const config = require('./config');
const path = require('path');

const cmdPath = path.resolve(__dirname, ('..' + path.sep).repeat(0)) + path.sep;
const paths = {
  $: path,
  root: cmdPath + '..' + path.sep,
  cmd: cmdPath
};

const app = {
  config: config,
  Queue,
  path: paths
};

module.exports = app;
