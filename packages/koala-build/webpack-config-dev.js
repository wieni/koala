const devServer = (paths) => ({
  hot: true,
  inline: true,
  port: 3000,
  publicPath: '/',
  stats: {
    // Config for minimal console.log mess.
    assets: false,
    builtAt: false,
    colors: true,
    chunks: false,
    chunkModules: false,
    entrypoints: false,
    hash: false,
    modules: false,
    timings: false,
    version: false,
  },
});

module.exports = devServer;
