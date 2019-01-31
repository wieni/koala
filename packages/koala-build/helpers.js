module.exports.transformGlobalsToDefine = (globals) => {
  return Object.keys(globals).reduce((result, key) => {
    result[key] = JSON.stringify(globals[key]);
    return result;
  }, {});
};

module.exports.transformGlobalsToEslint = (globals) => {
  return Object.keys(globals).reduce((result, key) => {
    result[key] = true;
    return result;
  }, {});
}
