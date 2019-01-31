const paths = require('./paths');

module.exports = {
  /**
   * (*) Enable debug
   */
  debug: true,
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
