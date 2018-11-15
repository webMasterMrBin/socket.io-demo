var { buildSchema } = require('graphql');
const shortid = require('shortid');
var schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Query {
    getMessage(id: ID!): Message
    getAllMessage: [Message]
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);

// 如果 Message 拥有复杂字段，我们把它们放在这个对象里面。
class Message {
  constructor(id, { content, author }) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

/*{
  id: {
    id,
    content,
    author
  }
}*/
const testId = 1;
const fakeDb = {
  [testId]: {
    id: testId,
    content: 'test content',
    author: 'slb',
  },
};

var root = {
  getAllMessage() {
    // 方法一 new 的方式
    const result = Object.values(fakeDb).map(
      o => new Message(o.id, { content: o.content, author: o.author })
    );
    // 方法二 返回 fakeDb的格式
    // const result1 = Object.values(fakeDb).map(o => o);
    return result;
  },

  getMessage({ id }) {
    if (!fakeDb[id]) {
      throw new Error('no message exists with id ' + id);
    }
    console.log('testId', testId);
    return new Message(id, fakeDb[id]);
  },

  createMessage({ input }) {
    var newId = shortid.generate();
    fakeDb[newId] = { id: newId, ...input };
    return new Message(newId, input);
  },

  updateMessage({ id, input }) {
    if (!fakeDb[id]) {
      throw new Error('no message exists with id ' + id);
    }
    fakeDb[id] = { id, ...input };
    return new Message(id, input);
  },
};

module.exports = { schema, root };
