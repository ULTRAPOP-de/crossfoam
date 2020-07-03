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
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

      {
        test: /\.js$/,
        loader: 'string-replace-loader',
        options: {
          multiple: [
             // remove d3's usage of innerHTML
            {
              search: `this.innerHTML = value;`,
              replace: `var that = this; this.textContent = ""; var parser = new DOMParser(); var parsed = parser.parseFromString(value, "text/html"); var tags = Array.from(parsed.getElementsByTagName("body")[0].childNodes); tags.forEach(function (tag) { that.append(tag); });`,
            },
            {
              search: `this.innerHTML = v == null ? "" : v;`,
              replace: `var that = this; this.textContent = ""; if (v != null) { var parser = new DOMParser(); var parsed = parser.parseFromString(v, "text/html"); var tags = Array.from(parsed.getElementsByTagName("body")[0].childNodes); tags.forEach(function (tag) { that.append(tag); }); }`,
            },
            // remove the DSVs parse usage of new Function > eval
            {
              search: /(return new Function\("d", "return {" \+ columns.map\(function\(name, i\) {)(\r\n|\r|\n)*(\t|\s)*(return JSON\.stringify\(name\) \+ ": d\[" \+ i \+ "\] \|\| \\"\\"";)(\r\n|\r|\n)*(\t|\s)*(\}\)\.join\(","\) \+ "\}"\);)/,
              replace: `return function (d) {var col = {};columns.forEach(function(name, i) {col[JSON.stringify(name)] = d[i] || "";});return col;};`,
            },
            // remove Function > eval from REGL
            {
              search: `callback = new Function("" + callback);`,
              replace: `callback = null;`
            },
            // WEBPACK
            {
              search: `g = g || new Function("return this")();`,
              replace: `if (typeof window === "object") g = window;`
            },
            // Graphology > FF-Validation thinks this is an evil import, but its not, its a custom function named import
            {
              search: `Graph.prototype.import = function _import(data) {`,
              replace: `Graph.prototype.importer = function _import(data) {`
            },
            {
              search: `this.import(data.export(), merge);`,
              replace: `this.importer(data.export(), merge);`
            },
            {
              search: `graph.import(this);`,
              replace: `graph.importer(this);`
            },
            {
              search: `instance.import(data);`,
              replace: `instance.importer(data);`
            }
          ]
        }
      }
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
        { from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js', to: 'browser-polyfill.js' },
        { from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js.map', to: 'browser-polyfill.js.map' },
        { from: 'node_modules/q/q.js', to: 'q.js' },
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