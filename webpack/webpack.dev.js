const merge = require("webpack-merge");
const common = require("./webpack.common.js");

modules = []

for (const exp of common) {
  modules.push(merge(exp, {
    devtool: "inline-source-map",
    mode: "development",
  }))
}

module.exports = modules
