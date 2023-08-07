import {useFetch} from '@niftgen/useFetch';
import {useCallback, useEffect, useRef} from 'react';
import {UPDATE, useNftCommentsStore} from './createStore.js';

import getCommentsQuery from './getComments.graphql';

export async function getNftComments({fetch, assetId}) {
  const body = await fetch(`/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: getCommentsQuery,
      variables: {assetId},
    }),
  });

  const {data, errors} = await body.json();
  if (data?.getNftComments) {
    return data?.getNftComments;
  }
  throw new Error(errors?.[0]?.message || 'Unknown server error');
}

export function useFetchComments() {
  const {fetch} = useFetch();
  const {dispatch} = useNftCommentsStore();

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(
    assetId => {
      if (!assetId) {
        return;
      }
      if (!fetch) {
        return;
      }
      getNftComments({fetch, assetId}).then(
        comments => {
          if (comments && isMounted.current) {
            dispatch({type: UPDATE, assetId, comments});
          }
        },
        error => console.error(error)
      );
    },
    [dispatch, fetch]
  );
}

export function useNftCommentsFetcher({id}) {
  const assetId = parseInt(id);

  const fetchComments = useFetchComments();
  const {state} = useNftCommentsStore();

  const isFetched = assetId in state;
  useEffect(() => {
    if (isFetched) {
      return;
    }

    async function commentsFetcher() {
      fetchComments(assetId);
    }

    commentsFetcher();
  }, [assetId, isFetched, fetchComments]);

  return null;
}
