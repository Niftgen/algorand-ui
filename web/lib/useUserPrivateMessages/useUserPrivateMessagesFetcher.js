import {useAuth} from '@niftgen/useAuth';
import {useFetch} from '@niftgen/useFetch';
import {useEffect, useRef} from 'react';

import getPrivateMessagesQuery from './getPrivateMessages.graphql';
import {useUserPrivateMessages} from './useUserPrivateMessages.js';

async function getUserPrivateMessages({fetch, walletAddress}) {
  const body = await fetch(`/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: getPrivateMessagesQuery,
      variables: {walletAddress},
    }),
  });

  const {data, errors} = await body.json();
  if (data?.getPrivateMessages) {
    return data?.getPrivateMessages;
  }
  throw new Error(errors?.[0]?.message || 'Unknown server error');
}

export function useUserPrivateMessagesFetcher() {
  const {fetch} = useFetch();
  const {update} = useUserPrivateMessages();
  const {walletAddress} = useAuth();

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

    async function messagesFetcher() {
      try {
        const messages = await getUserPrivateMessages({fetch, walletAddress});
        if (messages && isMounted.current) {
          update(messages);
        }
      } catch (error) {
        console.error(error);
      }
    }

    messagesFetcher();
  }, [fetch, update, walletAddress]);

  return null;
}
