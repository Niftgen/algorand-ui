import {createStore} from '@niftgen/useStore';

export const ADD = 'nft comments add';
export const REMOVE = 'nft comments remove';
export const UPDATE = 'nft comments update';

const initialState = {};

function onAdd(state, {comment}) {
  if (!comment?.asset?.id) {
    return state;
  }
  const comments = state[comment.asset.id] || [];
  if (comments.find(({id}) => id === comment.id)) {
    return state;
  }
  return {
    ...state,
    [comment.asset.id]: [comment].concat(comments),
  };
}

function onRemove(state, {assetId, id}) {
  if (!state[assetId]) {
    return state;
  }
  const comments = state[assetId];
  return {
    ...state,
    [assetId]: comments.filter(comment => comment.id !== id),
  };
}

function commentsSorter(a, b) {
  if (a.id < b.id) {
    return 1;
  }
  if (a.id > b.id) {
    return -1;
  }
  return 0;
}

function onUpdate(state, {comments}) {
  const nextState = comments.reduce((result, comment) => onAdd(result, {comment}), state);
  Object.values(nextState).forEach(bucket => bucket.sort(commentsSorter));
  return nextState;
}

const {useStore, StoreProvider} = createStore({
  actions: {
    [UPDATE]: onUpdate,
    [ADD]: onAdd,
    [REMOVE]: onRemove,
  },
  initialState,
  name: 'NftComments',
});

export const useNftCommentsStore = useStore;
export const NftCommentsProvider = StoreProvider;
