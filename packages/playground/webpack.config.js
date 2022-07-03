const HtmlWebpackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: { index: "./src/index.ts" },
  output: {
    filename: "[name].[hash].js",
    path: __dirname + "/output",
  },
  module: {
    rules: [
      {
        // 同时认识ts jsx js tsx 文件
        test: /\.(t|j)s?$/,
        use: "babel-loader",
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
  plugins: [
    // see https://github.com/ampedandwired/html-webpack-plugin

    new HtmlWebpackPlugin({
      template: `./public/index.html`,
      filename: `index.html`,
    }),
    new CleanWebpackPlugin(),
    new MonacoWebpackPlugin({
      languages: ["javascript", "css", "html", "json"],
      features: ["coreCommands", "find"],
    }),
  ],
  devServer: {
    hot: true,
    port: 8080,
  },
};
