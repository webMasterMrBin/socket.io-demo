module.exports = {
  apps: [
    {
      name: "socket.io-demo",
      script: "./bin/www.js",
      watch: true,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
