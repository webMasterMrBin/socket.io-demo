const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const extractLESS = new ExtractTextPlugin("css/[name].css");

const env = process.env.NODE_ENV;
console.log("env", env);

const config = {
  entry: {
    main: "./public/src/js/index.js",
    vendor: ["react", "react-dom", "redux", "react-redux", "lodash", "moment"]
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "/public/build"),
    publicPath: env === "dev" ? "http://localhost:4001/public/" : "./build/",
    chunkFilename: "[id].js"
  },
  devServer: {
    index: "",
    port: 4001,
    publicPath: "http://localhost:4001/public/",
    hot: true,
    proxy: {
      "/login": {
        // login请求 走express4000端口代理
        // 浏览器请求(浏览器地址栏直接访/login) 用开发的index.html渲染
        target: "http://localhost:4000",
        bypass(req) {
          if (req.headers.accept.indexOf("html") !== -1) {
            console.log("Skipping proxy for browser request.(/login)");
            return "/index.html";
          }
        }
      },
      "/api": {
        target: "http://localhost:4000"
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", { loader: "css-loader" }]
      },
      {
        test: /\.less$/,
        use:
          env !== "dev"
            ? extractLESS.extract({
                fallback: "style-loader",
                use: [
                  {
                    loader: "css-loader",
                    options: {
                      minimize: true //css压缩
                    }
                  },
                  {
                    loader: "less-loader"
                  }
                ]
              })
            : ["style-loader", "css-loader", "less-loader"]
      }
    ]
  },
  resolve: {
    modules: [path.join(__dirname, "./public/src/js"), "node_modules"]
  },
  plugins: [
    new webpack.ProvidePlugin({
      _: "lodash",
      React: "react",
      ReactDOM: "react-dom",
      moment: "moment"
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ["vendor", "manifest"],
      minChunks: Infinity
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      DEV_URL: JSON.stringify("http://localhost:4000"),
      "process.env": {
        NODE_ENV: JSON.stringify(env)
      },
      NODE_ENV: JSON.stringify(env)
    })
  ]
};
// 生产环境
if (env !== "dev") {
  config.plugins.push(extractLESS);
  config.plugins.push(
    new UglifyJsPlugin({
      // 最紧凑的输出
      beautify: false,
      // 删除所有的注释
      comments: false,
      parallel: true
    })
  );
} else {
  config.devtool = "source-map";
}

module.exports = config;
