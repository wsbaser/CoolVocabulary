'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: path.resolve(__dirname, "./dev"),
  entry: {
    background: "./js/background",
    content: "./js/content",
    popupde: "./js/popup/de",    
    popuplogin: "./js/popup/login"
  },

  output: {
    path: __dirname + '/public/assets',
    filename: "[name].js",
    library: "[name]"
  },

  watch: NODE_ENV == 'development',

  watchOptions: {
    aggregateTimeout: 100
  },

  devtool: NODE_ENV == 'development' ? "cheap-inline-module-source-map" : null,

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "common"
    }),
    new webpack.ProvidePlugin({
      '$':'jquery' 
    })
  ],

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions:         ['', '.js', '.styl'],
    root: [
      path.resolve('./dev/js/utils'),
      path.resolve('./dev/js')
    ]
  },

  resolveLoader: {
    modulesDirectories: ['node_modules'],
    moduleTemplates:    ['*-loader', '*'],
    extensions:         ['', '.js']
  },        

  module: {
  	loaders:[{
  		test: /\.js$/,
  		loader: 'babel?presets[]=es2015'
  	}]
  }
};

if (NODE_ENV == 'production') {
  module.exports.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          // don't show unreachable variables etc
          warnings:     false,
          drop_console: true,
          unsafe:       true
        }
      })
  );
}