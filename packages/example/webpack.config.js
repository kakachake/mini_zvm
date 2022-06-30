const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
    if: "./src/if.js",
  },
  output: {
    filename: "[name].[hash].js",
  },
  module: {
    rules: [],
  },
  plugins: [
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      template: "./if.html",
      filename: "if.html",
      chunks: ["if"],
    }),
  ],
  devServer: {
    hot: true,
    port: 8080,
  },
};
