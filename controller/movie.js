const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const rp = require('request-promise');
const movie_url = 'https://www.dytt8.net';

module.exports = {
  getAllMovie(req, res) {
    request(
      {
        url: movie_url,
        method: 'get',
        gzip: true,
        encoding: null,
      },
      (err, response, body) => {
        const $ = cheerio.load(iconv.decode(body, 'gb2312'), {
          decodeEntities: false,
        });
        const selector = $('.co_content2 ul a');
        const count = [];
        (async () => {
          for (let i = 2; i < selector.length; i++) {
            const href = selector.eq(i).attr('href');
            count.push(
              rp({
                url: `${movie_url}${href}`,
                method: 'get',
                encoding: null,
              })
                .then(d => {
                  console.log(`第${i}本电影信息开始爬取`);
                  return d;
                })
                .catch(err => {
                  console.log('err', err);
                  return '网络问题';
                })
            );
            // NOTE 方法二继发请求
            // const href = selector.eq(i).attr('href');
            // console.log(`第${i}本电影信息开始爬取`);
            // const detail_res = await rp({
            //   url: `${movie_url}${href}`,
            //   method: 'get',
            //   encoding: null,
            // });
            // const $detail = cheerio.load(iconv.decode(detail_res, 'gb2312'), {
            //   decodeEntities: false,
            // });
            // result.push({
            //   title: $detail('head title').text(),
            //   download: $detail('#Zoom table a').attr('href'),
            //   link: `${movie_url}${href}`,
            // });
          }
          // NOTE 方法一并发发发请求
          const res_arr = await Promise.all(count);
          const result1 = res_arr.map((o, i) => {
            const $detail = cheerio.load(iconv.decode(o, 'gb2312'), {
              decodeEntities: false,
            });
            return {
              title: $detail('head title').text(),
              download: $detail('#Zoom table a').attr('href'),
              link: `${movie_url}${selector.eq(i).attr('href')}`,
            };
          });
          res.json(result1);
        })();
      }
    );
  },
};
