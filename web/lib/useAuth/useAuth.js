import {useCallback} from 'react';
import {LOGOUT, UPDATE_ADDRESS, UPDATE_PROVIDER, UPDATE_TOKEN, useAuthStore} from './createStore';

export function useAuth() {
  const {
    state: {provider, walletAddress, token},
    dispatch,
  } = useAuthStore();

  const updateToken = useCallback(
    token => {
      if (token) {
        window.localStorage.setItem('jwt', token);
      } else {
        window.localStorage.removeItem('jwt');
      }
      dispatch({type: UPDATE_TOKEN, token});
    },
    [dispatch]
  );

  const updateProvider = useCallback(
    provider => {
      if (provider) {
        window.localStorage.setItem('provider', provider);
      } else {
        window.localStorage.removeItem('provider');
      }
      dispatch({type: UPDATE_PROVIDER, provider});
    },
    [dispatch]
  );

  const updateAddress = useCallback(
    walletAddress => {
      if (walletAddress) {
        window.localStorage.setItem('walletAddress', walletAddress);
      } else {
        window.localStorage.removeItem('walletAddress');
      }
      dispatch({type: UPDATE_ADDRESS, walletAddress});
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    if (provider === 'PeraWallet') {
      await window.PeraWallet.disconnect();
    }
    if (provider === 'Magic') {
      await window.Magic.user.logout();
    }
    window.localStorage.clear();
    dispatch({type: LOGOUT});
    window.document.location = '/';
  }, [dispatch, provider]);

  return {
    provider,
    walletAddress,
    token,
    updateProvider,
    updateAddress,
    updateToken,
    logout,
  };
}
