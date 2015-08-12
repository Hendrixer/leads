module.exports = {
  output: {
    filename: 'bundle.js'
  },
  devtool: 'sourcemaps',
  module: {
    loaders: [
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url?limit=100000' },
      { test: /\.js$/, loader: 'babel?stage=1', exclude: [/node_modules/] },
      { test: /\.styl$/, loader: 'style!css!stylus' },
      { test: /\.css$/, loader: 'style!css' }
    ]
  },

  stylus: {
    use: [require('jeet')(), require('rupture')()]
  }
};
