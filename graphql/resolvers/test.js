// Provide resolver functions for your schema fields
const TestResolvers = {
  Query: {
    test() {
      return 'this is test';
    },
  },
};

module.exports = TestResolvers;
