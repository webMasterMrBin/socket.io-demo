const initialState = {
  previewOpen: false,
  fileName: '',
  preType: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'PREVIEW_OPEN':
      return {
        previewOpen: true,
        fileName: action.fileName,
        preType: action.preType
      };
    case 'PREVIEW_CLOSE':
      return { previewOpen: false };
    default:
      return state;
  }
};
