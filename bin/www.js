const app = require('../app');
const http = require('http');
const debug = require('debug')('http');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack.config.js');
const path = require('path');

const server = http.createServer(app);

server.listen(4000);

// TODO webpack-dev-server node api 配置
// const options = {
//   contentBase: path.join(__dirname, "public/build"),
// 	hot: true,
//   // inline: true,
//   host: "localhost",
// 	// proxy: {
// 	// 	'*': 'http://localhost:4000',
// 	// },
// };
//
// WebpackDevServer.addDevServerEntrypoints(config, options);
//
// new WebpackDevServer(webpack(config), options).listen(8080, 'localhost', function (err, result) {
// 	if (err) {
// 		return console.log(err);
// 	}
// 	console.info('webpack dev server listening at http://localhost:8080/');
// });

server.on('listening', () => {
  debug('listening on 4000');
})
