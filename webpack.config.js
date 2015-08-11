module.exports = {
  output: {
    filename: 'bundle.js'
  },
  devtool: 'sourcemaps',
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel?stage=1', exclude: [/node_modules/] },
      { test: /\.styl$/, loader: 'style!css!stylus' },
      { test: /\.css$/, loader: 'style!css' }
    ]
  }
};
