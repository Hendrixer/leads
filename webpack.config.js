module.exports = {
  output: {
    filename: 'bundle.js'
  },
  devtool: 'sourcemaps',
  module: {
    loaders: [
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url?limit=100000' },
      { test: /\.js$/, loader: 'babel?optional[]=runtime&stage=0', exclude: [/node_modules/] },
      { test: /\.styl$/, loader: 'style!css!stylus' },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.html$/, loader: 'raw' }
    ]
  },

  stylus: {
    use: [require('jeet')(), require('rupture')()]
  }
};
