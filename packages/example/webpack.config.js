const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  entry: {
    nvm: "./src/index.js",
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
      inject: "head",
      filename: "index.html",
    }),
  ],
  devServer: {
    hot: true,
    port: 8080,
  },
};
