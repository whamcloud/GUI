/* eslint-env node */

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const extractLess = new ExtractTextPlugin('[name].[contenthash].css');

const config = {
  devtool: 'source-map',
  target: 'web',
  entry: './source/iml/iml-module.js',
  output: {
    publicPath: '/gui/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader:
          'url-loader?limit=1000&mimetype=application/font-woff&name=/gui/[hash].[ext]'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=/gui/[hash].[ext]'
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.js$/,
        exclude: /(node_modules\/angular|node_modules\/nvd3\/build|node_modules\/d3)|node_modules\/lodash/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                'env',
                {
                  targets: {
                    browsers: [
                      'last 1 chrome version',
                      'last 1 firefox version'
                    ],
                    modules: false,
                    forceAllTransforms: process.env.NODE_ENV === 'production'
                  }
                }
              ]
            ],
            plugins: [
              ['transform-object-rest-spread', { useBuiltIns: true }],
              'transform-flow-strip-types',
              'transform-class-properties',
              'syntax-jsx',
              'inferno',
              [
                'angularjs-annotate',
                {
                  explicitOnly: true
                }
              ]
            ],
            babelrc: false
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.ejs'
    })
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(extractLess);
  config.module.rules.push({
    test: /\.less$/,
    use: extractLess.extract({
      use: [
        {
          loader: 'css-loader'
        },
        {
          loader: 'less-loader'
        }
      ]
    })
  });
} else {
  config.module.rules.push({
    test: /\.less$/,
    use: [
      {
        loader: 'style-loader' // creates style nodes from JS strings
      },
      {
        loader: 'css-loader' // translates CSS into CommonJS
      },
      {
        loader: 'less-loader' // compiles Less to CSS
      }
    ]
  });
}

module.exports = config;
