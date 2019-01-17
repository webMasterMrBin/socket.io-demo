const initialState = {
  treeList: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'MOCKUP_LIST':
      return {
        treeList: action.list,
      };
    default:
      return state;
  }
};
