const fs = require('fs');
const path = require('path');
/*[
    {
      title: 'Ant',
      key: '0-0',
      children: [{
        title: 'assets',
        key: '0-0-0',
        children: [
          {
            title: '...svg',
            key: '0-0-0-0'
          }
        ]
      }],
    },
    {
      title: '.DS_Store',
      key: '0-1'
    }
]*/

function cb(pathname, target, i) {
  if (pathname.includes('index.html')) {
    const arr1 = pathname.split('/');
    arr1.shift();
    target.push({
      title: arr1[0],
      key: `${i}-0`,
      children: [
        {
          title: arr1[1],
          key: `${i}-0-0`,
        },
      ],
    });
  }
}

// 遍历一个文件夹查找其结构
function getFileTree(dir, cb, target) {
  fs.readdir(dir, (err, info) => {
    if (err) {
      console.log('err');
    } else {
      info.forEach((o, i) => {
        const pathname = path.join(dir, o);
        if (fs.statSync(pathname).isDirectory()) {
          getFileTree(pathname, cb, target);
        } else {
          cb(pathname, target, i);
        }
      });
    }
  });
}

module.exports = target => getFileTree('mockups', cb, target);
