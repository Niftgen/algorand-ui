import {useCallback} from 'react';
import {REMOVE, UPDATE, useAccountStore} from './createStore';

export function useAccount() {
  const {state: account, dispatch} = useAccountStore();

  const update = useCallback(
    payload => {
      dispatch({type: UPDATE, ...payload});
    },
    [dispatch]
  );

  const remove = useCallback(() => {
    dispatch({type: REMOVE});
  }, [dispatch]);

  return {
    account,
    update,
    remove,
  };
}
