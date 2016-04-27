var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HTMLPlugin = require('webpack-html-plugin');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToNg = path.resolve(node_modules, 'angular/angular.min.js');
var pathToNgMaterial = path.resolve(node_modules, 'angular-material/angular-material.min.js');
var pathToNgAnimate = path.resolve(node_modules, 'angular-animate/angular-animate.min.js');
var pathToUiRouter = path.resolve(node_modules, 'angular-ui-router/release/angular-ui-router.min.js');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

module.exports = {
  entry: './client/app/app.js',
  resolve: {
    alias: {
      'ngMaterial.css': path.resolve(node_modules, 'angular-material/angular-material.min.css'),
      ngTableCss: path.resolve(node_modules, 'angular-material-data-table/dist/md-data-table.min.css')
    }
  },
  output: {
    filename: 'bundle.js',
    path: 'dist'
  },

  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url?limit=100000' },
      { test: /\.js$/, loader: 'babel', exclude: [/node_modules/] },
      { test: /\.styl$/, loader: ExtractTextPlugin.extract('style', 'css!stylus') },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css') },
      { test: /\.html$/, loader: 'raw' }
    ],

    noParse: []
  },

  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   compressor: {
    //     warnings: false
    //   }
    // }),
    new ExtractTextPlugin('styles.css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new HTMLPlugin({
      inject: true,
      template: __dirname + '/client/index.html',
      name: 'index.html'
    }),
  ],

  stylus: {
    use: [require('jeet')(), require('rupture')()]
  }
};
