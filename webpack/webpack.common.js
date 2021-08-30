const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = [
  {
    entry: {
      main: path.join(srcDir, "main.ts"),
      options: path.join(srcDir, "options.tsx"),
    },
    output: {
      path: path.join(__dirname, "../dist"),
      filename: "[name].js",
    },
    optimization: {
      splitChunks: {
        name: "vendor",
        chunks: "initial",
      },
      minimizer: [
        new CssMinimizerPlugin(),
      ],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader",
          ],
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: ".", to: "./", context: "public" }],
        options: {},
      }),
      new MiniCssExtractPlugin({
        filename: "style.css",
      })
    ],
  },
  {
    entry: {
      background: path.join(srcDir, "background.ts"),
    },
    output: {
      path: path.join(__dirname, "../dist"),
      filename: "[name].js",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
  }
]
