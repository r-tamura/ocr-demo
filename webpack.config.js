/* flow */
const AsyncAwaitPlugin = require('webpack-async-await')

const config = {
  devtool: '#inline-source-map',
  entry: './src/main.js',
  output: {
    path: 'public',
    filename: 'bundle.js',
  },
  plugins: [
    new AsyncAwaitPlugin({}),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
      },
    ],
  },
}

module.exports = config
