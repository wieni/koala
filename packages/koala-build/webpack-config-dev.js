const devServer = (paths) => ({
  compress: true,
  hot: true,
  inline: true,
  port: 3000,
  publicPath: '/',
  quiet: true,
  stats: 'none',
  overlay: false,
});

module.exports = devServer;
