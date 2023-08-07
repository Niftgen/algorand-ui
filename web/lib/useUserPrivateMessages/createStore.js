import {createStore} from '@niftgen/useStore';

export const ADD = 'user private messages add';
export const REMOVE = 'user private messages remove';
export const UPDATE = 'user private messages update';

const initialState = [];

function onAdd(state, {message}) {
  if (state.find(({id}) => id === message.id)) {
    return state;
  }
  return [message].concat(state);
}

function onRemove(state, {id}) {
  return state.filter(message => message.id !== id);
}

function onUpdate(_state, {messages}) {
  return messages.reverse().reduce((result, message) => onAdd(result, {message}), initialState);
}

const {useStore, StoreProvider} = createStore({
  actions: {
    [UPDATE]: onUpdate,
    [ADD]: onAdd,
    [REMOVE]: onRemove,
  },
  initialState,
  name: 'UserPrivateMessages',
});

export const useUserPrivateMessagesStore = useStore;
export const UserPrivateMessagesProvider = StoreProvider;
