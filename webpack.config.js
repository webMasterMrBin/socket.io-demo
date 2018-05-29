const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractLESS = new ExtractTextPlugin('css/[name].css');

module.exports = {
  mode: 'development',
  entry: {
		main: './public/src/js/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/public/build'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.less$/,
        use: extractLESS.extract({
            use: [{
                  loader: "css-loader" // translates CSS into CommonJS
                  }, {
                  loader: "less-loader" // compiles Less to CSS
                }],
            fallback: "style-loader"
          })
      }
    ],
  },
	resolve: {
		modules: [
			path.join(__dirname, './public/src/js'),
			'node_modules',
		]
	},
  plugins: [
		new webpack.ProvidePlugin({
			React: 'react',
			ReactDOM: 'react-dom',
		}),
		extractLESS
  ]
};
