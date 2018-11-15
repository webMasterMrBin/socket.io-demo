const { makeExecutableSchema } = require('apollo-server-express');
const { mergeSchemas } = require('apollo-server');
const resolvers = require('./resolvers');
const fs = require('fs');
const path = require('path');
// const { mergeTypes, mergeResolvers } = require('merge-graphql-schemas');

// 方法1 使用apollo-server2的mergeSchema
const typeFiles = fs.readdirSync(path.join(__dirname, 'types'));
const schemas = typeFiles.map(o => {
  return makeExecutableSchema({
    typeDefs: fs.readFileSync(path.join(__dirname, `types/${o}`), 'utf8'),
    resolvers: resolvers[o.split('.')[0]],
  });
});

const schema = mergeSchemas({
  schemas: schemas,
});

// 方法二使用merge-graphql-schemas库
// const types = mergeTypes([Hello, Test], { all: true });
// const resolvers = mergeResolvers([HelloResolvers, TestResolvers]);
/*NOTE types转换为
schema {
  query: Query
  muration: Muration
}
type Query {
  hello: String
  test: String
}
type Muration {

}
*/
//
// const schema = makeExecutableSchema({
//   typeDefs: types,
//   resolvers,
// });

module.exports = { schema };
