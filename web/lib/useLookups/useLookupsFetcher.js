import {useFetch} from '@niftgen/useFetch';
import {useEffect, useRef} from 'react';
import {UPDATE, useLookupsStore} from './createStore';

import query from './getLookups.graphql';

async function getLookups({fetch}) {
  const body = await fetch(`/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({query}),
  });

  const {data, errors} = await body.json();
  if (data?.getLookups) {
    return data?.getLookups;
  }
  throw new Error(errors?.[0]?.message || 'Unknown server error');
}

export function useLookupsFetcher() {
  const {fetch} = useFetch();
  const {dispatch} = useLookupsStore();

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!fetch) {
      return;
    }
    getLookups({fetch}).then(
      lookups => {
        if (isMounted.current) {
          dispatch({type: UPDATE, lookups});
        }
      },
      error => {
        console.error(error);
      }
    );
  }, [fetch, dispatch]);

  return null;
}
