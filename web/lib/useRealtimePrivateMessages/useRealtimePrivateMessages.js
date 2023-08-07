import {compileFragments} from '@niftgen/compileFragments';
import {notificationFragment} from '@niftgen/fragments.notification';
import {useGraphqlSubscription} from '@niftgen/useGraphqlSubscription';
import {ADD, REMOVE, useUserPrivateMessagesStore} from '@niftgen/useUserPrivateMessages';
import {useCallback, useMemo} from 'react';
import onNotification from './onNotification.graphql';

const query = compileFragments(onNotification, notificationFragment);
const error = e => console.error(e);

export function useRealtimePrivateMessages({userId}) {
  const {dispatch} = useUserPrivateMessagesStore();

  const next = useCallback(
    ({value}) => {
      const data = value?.data?.onNotification;
      if (!data) {
        console.error(value);
        return;
      }
      if (data.assetId !== null) {
        // Skip NFT messages
        return;
      }
      if (data.deletedCommentId && !data.comment) {
        dispatch({type: REMOVE, id: data.deletedCommentId});
      }
      if (data.comment) {
        dispatch({type: ADD, message: data.comment});
      }
    },
    [dispatch]
  );

  const params = useMemo(() => ({userId}), [userId]);
  const enabled = Boolean(userId);
  useGraphqlSubscription(query, params, next, error, enabled);

  return null;
}
