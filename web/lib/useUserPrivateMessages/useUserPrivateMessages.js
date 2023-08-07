import {useCallback} from 'react';
import {ADD, REMOVE, UPDATE, useUserPrivateMessagesStore} from './createStore';

export const useUserPrivateMessages = () => {
  const {state: messages, dispatch} = useUserPrivateMessagesStore();

  const add = useCallback(
    message => {
      dispatch({type: ADD, message});
    },
    [dispatch]
  );

  const remove = useCallback(
    id => {
      dispatch({type: REMOVE, id});
    },
    [dispatch]
  );

  const update = useCallback(
    userPrivateMessages => {
      dispatch({type: UPDATE, messages: userPrivateMessages});
    },
    [dispatch]
  );

  return {messages, add, remove, update};
};
