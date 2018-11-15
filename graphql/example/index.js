var { buildSchema } = require('graphql');
// 使用 GraphQL schema language 构建一个 schema
var schema = buildSchema(`
  type Child {
    test: String
  }
  type Slb {
    key: [String]
    suck(pa2: Int): [Child]
  }
  type Query {
    hello: String
    slb(pa1: Int): Slb
  }
`);

class Slb {
  constructor(key) {
    this.key = key;
  }

  suck() {
    return [new Child('nnn'), new Child('mm')];
  }
}

class Child {
  constructor(test) {
    this.test = test;
  }
}

// 根节点为每个 API 入口端点提供一个 resolver 函数
var root = {
  hello: () => {
    return 'Hello world发到付!';
  },
  slb() {
    // eslint-disable-next-line
    return new Slb(['fff']);
  },
};

module.exports = { root, schema };
