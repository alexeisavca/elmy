var webpack = require('webpack');
var path = require('path');
module.exports = {
  entry: {
    main: "./examples/index.jsx"
  },
  output: {
    filename: "./examples/index.js"
  },
  module: {
    loaders: [
      { test: /\.(jsx|es6)$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.css$/, exclude: /\.useable\.css$/, loader: "style!css" },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.es6', '.jsx']
  },
  devtool: 'source-map'
};