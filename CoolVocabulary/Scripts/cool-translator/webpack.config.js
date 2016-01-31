// 'use strict';

// const NODE_ENV = process.env.NODE_ENV || 'development';
// const webpack = require('webpack');

// module.exports = {
// 	entry: "./home",
// 	output: {
// 		filename: "build.js",
// 		library: 'home'
// 	},
// 	watch: NODE_ENV == 'development',
// 	watchOptions: {
// 		aggregateTimeout: 100
// 	},
// 	devtool: 'cheap-inline-module-source-map',
// 	plugins: [
// 		new webpack.EnvironmentPlugin('NODE_ENV')
// 	],
// 	module: {
// 		loaders:[{
// 			test:/\.js$/,
// 			loader: 'babel?presets[]=es2015'
// 		}]
// 	}
// }

'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');

module.exports = {
  context: __dirname + '/js',
  entry: {
    home: "./home",
    background: "./background",
    content: "./content"
    popupde: "./popup/popup_de",    
    popuplogin: "./popup/popup_login"
  },

  output: {
    path: __dirname + 'public',
    filename: "[name].js",
    library:  "[name]"
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
    })
  ],


  resolve: {
    modulesDirectories: ['node_modules'],
    extensions:         ['', '.js']
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