const paths = require('./paths');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const helpers = require('./helpers');

const config = require(paths.appConfig);

const isProduction = argv => argv.mode === 'production';

const devServer = require('./webpack-config-dev');

module.exports = (env, argv) => {
  isEnvDevelopment = !isProduction(argv);
  isEnvProduction = isProduction(argv);

  const globals = helpers.transformGlobalsToDefine(config.globals);

  const cssRegex = /\.css$/;
  const sassRegex = /\.(scss|sass)$/;

  const getStyleLoaders = (cssOptions) => ([
    isEnvDevelopment && require.resolve('style-loader'),
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ],
        sourceMap: false,
      },
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
      },
    },
  ].filter(Boolean))

  return {
    devServer: {
      ...devServer(paths)
    },
    mode: isEnvProduction ? 'production' : 'development',
    devtool: isEnvProduction ? '' : 'source-map',
    entry: [
      isEnvDevelopment && require.resolve('webpack-dev-server/client') + '?/',
      isEnvDevelopment && require.resolve('webpack/hot/dev-server'),
      isEnvDevelopment &&
        require.resolve('react-dev-utils/webpackHotDevClient'),
      paths.appIndexJs,
     ].filter(Boolean),
    output: {
      path: paths.appBuild,
      filename: '[name].js',
      chunkFilename: '[name].chunk.js',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          enforce: 'pre',
          use: [
            {
              options: {
                formatter: require.resolve('react-dev-utils/eslintFormatter'),
                eslintPath: require.resolve('eslint'),
                baseConfig: {
                  root: true,
                  parser: 'babel-eslint',
                  extends: 'airbnb',
                  plugins: [
                    'import',
                    'jsx-a11y',
                    'react'
                  ],
                  globals: config.globals ? helpers.transformGlobalsToEslint(config.globals) : {},
                  env: {
                    browser: true,
                    commonjs: true,
                    es6: true,
                    jest: true,
                    node: true,
                  },
                  parserOptions: {
                    ecmaVersion: 2018,
                    sourceType: 'module',
                    ecmaFeatures: {
                      jsx: true,
                    },
                  },
                  settings: {
                    'import/resolver': {
                      'node': {
                        'extensions': [
                          '.js',
                          '.jsx',
                        ],
                        'paths': [
                          paths.appSrc,
                        ],
                      },
                    },
                    'react': {
                      'version': 'detect',
                    },
                  },
                  rules: {
                    'react/jsx-filename-extension': [
                      1, {
                        'extensions': ['.js', '.jsx'],
                      },
                    ],
                  },
                },
                ignore: false,
                useEslintrc: false,
              },
              loader: require.resolve('eslint-loader'),
            },
          ],
          include: paths.appSrc,
        },
        {
          test: /\.(js|jsx)$/,
          exclude: paths.appNodeModules,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                cacheCompression: isEnvProduction,
                compact: isEnvProduction,
                presets: [
                  '@babel/react',
                ],
                plugins: [
                  'react-hot-loader/babel',
                  '@babel/plugin-syntax-dynamic-import',
                  '@babel/plugin-transform-react-constant-elements',
                  '@babel/plugin-transform-react-inline-elements',
                  'babel-plugin-polished',
                ]
              }
            }
          ].filter(Boolean),
        },
        {
          test: cssRegex,
          use: getStyleLoaders({
            importLoaders: 1,
            sourceMap: false,
          }),
          // Don't consider CSS imports dead code even if the
          // containing package claims to have no side effects.
          // Remove this when webpack adds a warning or an error for this.
          // See https://github.com/webpack/webpack/issues/6571
          sideEffects: true,
        },
        {
          test: sassRegex,
          use: getStyleLoaders(
            {
              importLoaders: 2,
              sourceMap: false
            },
            'sass-loader'
            ),
            sideEffects: true,
          },
          {
            test: /\.(png|jp(e*)g|svg|gif)$/,
            loader: 'file-loader',
          },
        ],
      },
      resolve: {
        modules: [
          paths.appSrc,
          paths.appNodeModules,
        ],
        extensions: paths.moduleFileExtensions.map(ext => `.${ext}`),
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        isEnvDevelopment && config.cleanup ? new CleanWebpackPlugin([paths.appBuild], {
          root: paths.appPath
        }) : false,
        isEnvDevelopment && config.drupack === false ? new HtmlWebpackPlugin({
          template: paths.appHtml,
        }) : false,
        isEnvProduction &&
          new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css',
            chunkFilename: '[name].[contenthash:8].chunk.css',
          }),
        new webpack.EnvironmentPlugin({
          NODE_ENV: isEnvProduction ? 'production' : 'development',
          APP_ENV: isEnvProduction ? 'production' : 'development',
        }),
        config.globals ? new webpack.DefinePlugin(globals) : false,
      ].filter(Boolean),
      optimization: {
        minimize: isEnvProduction,
        minimizer: [
          // This is only used in production mode
          new TerserPlugin({
            terserOptions: {
              parse: {
                // we want terser to parse ecma 8 code. However, we don't want it
                // to apply any minfication steps that turns valid ecma 5 code
                // into invalid ecma 5 code. This is why the 'compress' and 'output'
                // sections only apply transformations that are ecma 5 safe
                // https://github.com/facebook/create-react-app/pull/4234
                ecma: 8,
              },
              compress: {
                ecma: 5,
                warnings: false,
                // Disabled because of an issue with Uglify breaking seemingly valid code:
                // https://github.com/facebook/create-react-app/issues/2376
                // Pending further investigation:
                // https://github.com/mishoo/UglifyJS2/issues/2011
                comparisons: false,
                // Disabled because of an issue with Terser breaking valid code:
                // https://github.com/facebook/create-react-app/issues/5250
                // Pending futher investigation:
                // https://github.com/terser-js/terser/issues/120
                inline: 2,
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 5,
                comments: false,
                // Turned on because emoji and regex is not minified properly using default
                // https://github.com/facebook/create-react-app/issues/2488
                ascii_only: true,
              },
            },
            // Use multi-process parallel running to improve the build speed
            // Default number of concurrent runs: os.cpus().length - 1
            parallel: true,
            // Enable file caching
            cache: true,
            sourceMap: false,
          }),
        ]
      }
    }
  };
