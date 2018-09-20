var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public/res/js/gen');
var APP_DIR = path.resolve(__dirname, 'scripts');

const srcs = [
  "Ui.js",
  "View.jsx"
];

const entries = srcs.map(src => `${APP_DIR}/${src}`);

var config = {
  entry: entries,
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module : {
    rules : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        use : 'babel-loader'
      }
    ]
  }
};

module.exports = config;