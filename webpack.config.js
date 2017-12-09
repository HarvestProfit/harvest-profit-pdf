const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

/**
 * This is our webpack config for the final built product.
 * It pumps out a dist/index.js file that is ready for web-based use.
 */
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  /* We don't need `fs`, so we pretend it doesn't exist */
  node: {
    fs: 'empty',
  },
  /* We use uglifyjs to compile/minify our gargantuan bundle from this project */
  plugins: [
    new UglifyJSPlugin({
      parallel: true,
    }),
  ],
  /* We use babel-loader to replicate the .babelrc file in webpack */
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              "airbnb",
              "stage-2",
            ],
          },
        },
      },
    ],
  },
};
