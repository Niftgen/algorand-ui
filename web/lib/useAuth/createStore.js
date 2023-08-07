import {createStore} from '@niftgen/useStore';

export const UPDATE_PROVIDER = 'auth update provider';
export const UPDATE_ADDRESS = 'auth update address';
export const UPDATE_TOKEN = 'auth update token';
export const LOGOUT = 'auth logout';

const initialState = {
  provider: '',
  walletAddress: '',
  token: null,
};

function onUpdateProvider(state, {provider}) {
  return state.provider === provider ? state : {...state, provider};
}

function onUpdateAddress(state, {walletAddress}) {
  return state.walletAddress === walletAddress ? state : {...state, walletAddress};
}

function onUpdateToken(state, {token}) {
  return state.token === token ? state : {...state, token};
}

function onLogout() {
  return initialState;
}

const {useStore, StoreProvider} = createStore({
  actions: {
    [UPDATE_PROVIDER]: onUpdateProvider,
    [UPDATE_ADDRESS]: onUpdateAddress,
    [UPDATE_TOKEN]: onUpdateToken,
    [LOGOUT]: onLogout,
  },
  initialState,
  name: 'Auth',
});

export const useAuthStore = useStore;
export const AuthProvider = StoreProvider;
