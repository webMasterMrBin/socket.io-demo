const db = require('../../model');
const shortid = require('shortid');
const moment = require('moment');

const ArticleResolvers = {
  Mutation: {
    createArticle(parent, args) {
      const {
        input: { title, content, author, description },
      } = args;

      return (async () => {
        try {
          const result = await db.article.create({
            articleId: shortid.generate(),
            title,
            create_time: moment().format(),
            author,
            content,
            description,
          });

          const { articleId, create_time } = result;

          return {
            title,
            author,
            articleId,
            create_time: `${create_time}`,
            description,
          };
        } catch (err) {
          console.log('err!!!', err);
          return { err: 'sth wrong' };
        }
      })();
    },
    createComment(parent, args) {
      const {
        input: { comment, author, articleId },
      } = args;

      return (async () => {
        try {
          const result = await db.comment.create({
            commentId: shortid.generate(),
            create_time: moment().format(),
            author,
            comment,
            articleId,
          });

          const { commentId, create_time } = result;

          return {
            author,
            commentId,
            create_time: `${create_time}`,
            comment,
          };
        } catch (err) {
          console.log('err!!!', err);
          return { err: 'sth wrong' };
        }
      })();
    },
  },
  Query: {
    getArticleList() {
      return (async () => {
        try {
          const list = await db.article.find();
          return list;
        } catch (err) {
          console.log('err!!!', err);
          return { err: 'sth wrong' };
        }
      })();
    },
    getArticleDetail(parent, args) {
      return (async () => {
        try {
          const result = await Promise.all([
            db.article.findOne({
              articleId: args.articleId,
            }),
            db.comment.find({
              articleId: args.articleId,
            }),
          ]);

          const [
            { author, content, create_time, title, articleId },
            commentList,
          ] = result;

          return {
            author,
            content,
            commentList,
            title,
            articleId,
            create_time,
          };
        } catch (err) {
          console.log('err!!!', err);
          return { err: 'sth wrong' };
        }
      })();
    },
  },
};

module.exports = ArticleResolvers;
