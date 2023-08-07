import {select as normaliseNft} from '@niftgen/useNfts';
import {useCallback} from 'react';
import {ADD, REMOVE, UPDATE, UPDATE_LOADING, useNotificationsStore} from './createStore';

export const useNotifications = () => {
  const {state, dispatch} = useNotificationsStore();
  const update = useCallback(
    notifications => {
      dispatch({type: UPDATE, notifications});
    },
    [dispatch]
  );

  const add = useCallback(
    notification => {
      dispatch({
        type: ADD,
        notification: {
          ...notification,
          asset: normaliseNft(notification.asset),
        },
      });
    },
    [dispatch]
  );

  const remove = useCallback(
    id => {
      dispatch({type: REMOVE, id});
    },
    [dispatch]
  );

  const updateLoading = useCallback(
    loading => {
      dispatch({type: UPDATE_LOADING, loading});
    },
    [dispatch]
  );

  return {
    notifications: state.notifications,
    loading: state.loading,
    update,
    add,
    remove,
    updateLoading,
  };
};
