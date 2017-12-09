const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  node: {
    fs: 'empty',
  },
  plugins: [
    new UglifyJSPlugin({
      parallel: true,
    }),
  ],
};
