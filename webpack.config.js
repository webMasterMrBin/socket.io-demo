const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractLESS = new ExtractTextPlugin('css/[name].css');

module.exports = {
  entry: {
		main: './public/src/js/index.js',
    vendor: ["react", "react-dom", "redux", "react-redux", "lodash", "moment"]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/public/build'),
    publicPath: "./build/",
    chunkFilename: "[id].js"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", { loader: "css-loader" }]
      },
      {
        test: /\.less$/,
        use: extractLESS.extract({
          fallback: "style-loader",
          use: ["css-loader", "less-loader"]
        })
      }
    ]
  },
	resolve: {
		modules: [
			path.join(__dirname, './public/src/js'),
			'node_modules',
		]
	},
  plugins: [
		new webpack.ProvidePlugin({
      _: "lodash",
      React: "react",
      ReactDOM: "react-dom",
      moment: "moment"
		}),
    new webpack.optimize.CommonsChunkPlugin({
      name: ["vendor", "manifest"] // 指定模块的名称
    }),
		extractLESS
  ]
};
