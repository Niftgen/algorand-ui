import {compileFragments} from '@niftgen/compileFragments';
import {notificationFragment} from '@niftgen/fragments.notification';
import {useAccount} from '@niftgen/useAccount';
import {useFetch} from '@niftgen/useFetch';
import {useEffect, useRef} from 'react';
import getNotificationsQuery from './getNotifications.graphql';
import {useNotifications} from './useNotifications';

async function getNotifications({fetch, walletAddress, notificationType, limit, offset}) {
  const body = await fetch(`/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: compileFragments(getNotificationsQuery, notificationFragment),
      variables: {
        walletAddress,
        notificationType,
        limit,
        offset,
      },
    }),
  });

  const {data, errors} = await body.json();
  if (data?.getNotifications) {
    return data?.getNotifications;
  }
  throw new Error(errors?.[0]?.message || 'Unknown server error');
}

export function useNotificationsFetcher({walletAddress, notificationType, limit, offset}) {
  const {fetch} = useFetch();
  const {account} = useAccount();
  const {update, updateLoading} = useNotifications();
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
    if (!walletAddress) {
      return;
    }
    if (account.id <= 0) {
      return;
    }

    async function notificationsFetcher() {
      updateLoading(true);

      try {
        const notifications = await getNotifications({fetch, walletAddress, notificationType, limit, offset});
        if (notifications && isMounted.current) {
          update(
            notifications.filter(notification =>
              ['COMMENT', 'RATING', 'EXPIRED_SUBSCRIPTION'].includes(notification.notificationType)
            )
          );
        }
      } catch (error) {
        console.error(error);
      }

      updateLoading(false);
    }

    notificationsFetcher();
  }, [account.id, fetch, walletAddress, notificationType, limit, offset, update, updateLoading]);

  return null;
}
