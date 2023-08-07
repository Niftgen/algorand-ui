import {useCallback} from 'react';
import {ADD, REMOVE, UPDATE, useNftCommentsStore} from './createStore';

export const useNftComments = ({id}) => {
  const {state, dispatch} = useNftCommentsStore();
  const assetId = parseInt(id);

  const comments = state[assetId] || [];

  const add = useCallback(
    comment => {
      dispatch({type: ADD, assetId, comment});
    },
    [assetId, dispatch]
  );

  const remove = useCallback(
    id => {
      dispatch({type: REMOVE, assetId, id});
    },
    [assetId, dispatch]
  );

  const update = useCallback(
    nftComments => {
      dispatch({type: UPDATE, assetId, comments: nftComments});
    },
    [assetId, dispatch]
  );

  return {comments, add, remove, update};
};
