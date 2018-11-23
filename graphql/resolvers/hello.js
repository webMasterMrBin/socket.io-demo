const HelloResolvers = {
  Query: {
    hello(parent, args) {
      // class Hello {
      //   constructor(world) {
      //     this.world = world;
      //   }
      //  }
      return { cid: args.cid };
    },
  },
  Hello: {
    world(parent, args) {
      console.log('parent', parent);
      console.log('args', args);
      return `cid为${parent.cid}`;
    },
  },
};

module.exports = HelloResolvers;
