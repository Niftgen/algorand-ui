import {useCallback} from 'react';
import {UPDATE, useLookupsStore} from './createStore';

export function useLookups() {
  const {state, dispatch} = useLookupsStore();

  const update = useCallback(
    payload => {
      dispatch({type: UPDATE, ...payload});
    },
    [dispatch]
  );

  return {
    lookups: state,
    update,
  };
}
