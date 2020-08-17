const getArgv = keys => {
  const argvs = process.argv.slice(2);
  for (let i = 0; i < argvs.length; i++) {
    if (keys.indexOf(argvs[i]) !== -1) {
      if (typeof argvs[i + 1] !== 'undefined' && argvs[i + 1][0] != '-') {return argvs[i + 1];}
    }
  }
  return null;
};

module.exports = getArgv;
