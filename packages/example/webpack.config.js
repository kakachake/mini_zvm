const HtmlWebpackPlugin = require("html-webpack-plugin");
const requireContext = require("require-context");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { webpack } = require("webpack");
const files = requireContext(path.join(__dirname, "./src"), false, /\.js$/);
const fs = require("fs");
const entries = {};
const plugins = [];
files.keys().forEach((key) => {
  console.log(key);
  key = key.replace(".js", "");
  entries[key] = `./src/${key}.js`;
  try {
    fs.accessSync(`./template/${key}.html`, fs.constants.R_OK);
    plugins.push(
      new HtmlWebpackPlugin({
        template: `./template/${key}.html`,
        filename: `${key}.html`,
        chunks: [key],
      })
    );
  } catch (e) {
    console.log(e);
  }
});

module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: { ...entries, index: "./index.js" },
  output: {
    filename: "[name].[hash].js",
    path: __dirname + "/output",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    // see https://github.com/ampedandwired/html-webpack-plugin
    ...plugins,
    new HtmlWebpackPlugin({
      template: `index.html`,
      filename: `index.html`,
      chunks: ["index"],
    }),
    new CleanWebpackPlugin(),
  ],
  devServer: {
    port: 8090,
    proxy: {
      "/api": {
        target: "http://101.43.155.53:9001",
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
