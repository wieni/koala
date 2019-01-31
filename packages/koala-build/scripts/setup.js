const fs = require('fs');
const path = require('path')
const paths = require('../paths');

fs.copyFileSync(path.resolve(__dirname, '../koala-config.default.js'), `${paths.appPath}/koala-config.js`, (err) => {
  if (err) {
    console.log(`❌  ${err}`);
  }

  console.log('🐨  Koala ready.');
});
