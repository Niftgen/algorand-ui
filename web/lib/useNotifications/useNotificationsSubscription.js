import {compileFragments} from '@niftgen/compileFragments';
import {notificationFragment} from '@niftgen/fragments.notification';
import {useAccount} from '@niftgen/useAccount';
import {useGraphqlSubscription} from '@niftgen/useGraphqlSubscription';
import {useCallback, useMemo} from 'react';
import onNotification from './onNotification.graphql';
import {useNotifications} from './useNotifications';

const query = compileFragments(onNotification, notificationFragment);
const error = e => console.error(e);

export function useNotificationsSubscription() {
  const {account} = useAccount();
  const {add} = useNotifications();

  const next = useCallback(
    ({value}) => {
      if (['COMMENT', 'RATING', 'EXPIRED_SUBSCRIPTION'].includes(value?.data?.onNotification?.notificationType)) {
        add(value?.data?.onNotification);
      }
    },
    [add]
  );
  const params = useMemo(() => ({userId: account.id}), [account.id]);
  const enabled = Boolean(account.id);
  useGraphqlSubscription(query, params, next, error, enabled);
}
