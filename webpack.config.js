var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToNg = path.resolve(node_modules, 'angular/angular.min.js');
var pathToNgMaterial = path.resolve(node_modules, 'angular-material/angular-material.min.js');
var pathToNgAnimate = path.resolve(node_modules, 'angular-animate/angular-animate.min.js');
var pathToUiRouter = path.resolve(node_modules, 'angular-ui-router/release/angular-ui-router.min.js');
var webpack = require('webpack');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv').load();

module.exports = {
  resolve: {
    alias: {
      'ngMaterial.css': path.resolve(node_modules, 'angular-material/angular-material.min.css'),
      ngTableCss: path.resolve(node_modules, 'angular-material-data-table/dist/md-data-table.min.css')
    }
  },
  output: {
    filename: 'bundle.js'
  },

  // externals: {
  //   angular: {
  //     root: 'angular',
  //     commonjs: 'angular',
  //     commonjs2: 'angular'
  //   },
  //   'angular-material': {
  //     commonjs2: 'angular-material',
  //     commonjs: 'angular-material'
  //   },
  //   'angular-aria': {
  //     commonjs: 'angular-aria',
  //     commonjs2: 'angular-aria'
  //   },
  //   'angular-ui-router': {
  //     commonjs: 'angular-ui-router',
  //     commonjs2: 'angular-ui-router'
  //   },
  //   'angular-animate': {
  //     commonjs2: 'angular-animate',
  //     commonjs: 'angular-animate'
  //   }
  // },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url?limit=100000' },
      { test: /\.js$/, loader: 'babel', exclude: [/node_modules/] },
      { test: /\.styl$/, loader: 'style!css!stylus' },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.html$/, loader: 'raw' }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      $pusherKey: JSON.stringify(process.env.PUSHER_APP_KEY),
      $raygunApiKey: JSON.stringify(process.env.RAYGUN_APIKEY),
      $pubnubPubKey: JSON.stringify(process.env.PUBNUB_PUBLISH_KEY),
      $pubnubSubKey: JSON.stringify(process.env.PUBNUB_SUBSCRIBE_KEY),
      $pubnubPrefix: JSON.stringify(process.env.PUBNUB_PREFIX)
    })
  ],

  stylus: {
    use: [require('jeet')(), require('rupture')()]
  }
};
