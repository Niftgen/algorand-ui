import {createStore} from '@niftgen/useStore';

export const UPDATE = 'nft notifications update';
export const ADD = 'nft notification add';
export const REMOVE = 'nft notification remove';
export const UPDATE_LOADING = 'nft notifications update loading';

const initialState = {
  notifications: [],
  loading: false,
};

function onUpdate(state, {notifications}) {
  return {
    ...state,
    notifications: [...notifications],
  };
}

function onAdd(state, {notification}) {
  return {
    ...state,
    notifications: [notification, ...state.notifications],
  };
}

function onRemove(state, {id}) {
  const {notifications} = state;

  return {
    ...state,
    notifications: notifications.filter(notification => notification.id !== id),
  };
}

function onUpdateLoading(state, {loading}) {
  return {
    ...state,
    loading,
  };
}

const {useStore, StoreProvider} = createStore({
  actions: {
    [UPDATE]: onUpdate,
    [ADD]: onAdd,
    [REMOVE]: onRemove,
    [UPDATE_LOADING]: onUpdateLoading,
  },
  initialState,
  name: 'Notifications',
});

export const useNotificationsStore = useStore;
export const NotificationsProvider = StoreProvider;
