const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

modules = []

for (const exp of common) {
  modules.push(merge(exp, {
    mode: "production",
    optimization: {
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin(),
      ],
    }
  }))
}

module.exports = modules
