const fs = require('fs');
fs.readdir('mockups', (err, info) => {
  console.log('info', info);
});

function test() {
  fs.stat('mockups', (err, stats) => {
    console.log('stats', stats);
    console.log(stats.isDirectory());
  });
}

module.exports = test;
