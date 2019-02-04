const paths = require('./paths');

module.exports = {
  sourceMap: true,
  /**
   * (*) Enable debug
   */
  debug: false,
  /**
   *  (*) Enable to cleanup the /build folder each time.
   */
  cleanup: true,
  /**
   *  (*) Enable when using Koala in a Drupal environment.
   */
  drupack: false,
  /**
   * (*) Global variables.
   */
  globals: {
    version: require(paths.appPackageJson).version,
  },
};
