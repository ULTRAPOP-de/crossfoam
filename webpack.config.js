const fs = require("fs");
const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const entry = {};

fs.readdirSync("./src/typescript").forEach((file) => {
  if(file != "." && file != ".."){
    entry[file.split(".")[0]] = "./src/typescript/" + file;
  }
});

module.exports = {
  mode: 'development',
  entry,
  output: {
    // This copies each source entry into the extension dist folder named
    // after its entry config key.
    path: __dirname + "/extension/assets/js",
    filename: '[name].js',
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".js", ".json"] // , ".ejs"
  },

  module: {
    // This transpiles all code (except for third party modules) using Babel.
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$/,
        // Babel options are in .babelrc
        use: {
          loader: 'babel-loader'
        }
      },
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.ts$/, loader: "awesome-typescript-loader" },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
      
    ]
  },

  plugins: [
    // Since some NodeJS modules expect to be running in Node, it is helpful
    // to set this environment var to avoid reference errors.
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js', to: 'extension/assets/js/browser-polyfill.js' },
        { from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js.map', to: 'extension/assets/js/browser-polyfill.js.map' },
        { from: 'node_modules/q/q.js', to: 'extension/assets/js/q.js' },
        { from: 'node_modules/codebird/codebird.js', to: 'extension/assets/js/codebird.js' },
      ]
    })
  ],

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals:[{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }],
};