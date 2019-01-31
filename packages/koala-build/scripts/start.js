const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const openBrowser = require('react-dev-utils/openBrowser');
const chalk = require('chalk');

const config = require('../webpack-config');
const webpackConfig = config({}, { mode: 'development' });

const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, webpackConfig.devServer);

server.listen(3000, '127.0.0.1', () => {
  // clearConsole();
  openBrowser('http://127.0.0.1:3000');
  console.log(`🌍 Starting server on ${chalk.yellow('http://localhost:8080')}`);
});
