import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import {useCallback} from 'react';

export const useFetch = () => {
  const {api, apikey} = useConfig();
  const {token, logout} = useAuth();

  const authorisedFetch = useCallback(
    (url, options = {}) => {
      const {headers, ...rest} = options;

      return fetch(`${api}${url}`, {
        method: 'POST',
        headers: {
          'x-api-key': apikey,
          Authorization: `Bearer ${token}`,
          ...headers,
        },
        ...rest,
      }).then(response => {
        if (response.status === 403) {
          // something wrong with the token, logout!
          logout();
          throw new Error('JWT Invalid, re-login please');
        }
        return response;
      });
    },
    [api, apikey, token, logout]
  );

  return {
    cacheKey: [api, apikey, token],
    fetch: api === undefined || !token ? null : authorisedFetch,
  };
};
