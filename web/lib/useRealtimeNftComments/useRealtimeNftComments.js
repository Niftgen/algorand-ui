import {compileFragments} from '@niftgen/compileFragments';
import {notificationFragment} from '@niftgen/fragments.notification';
import {useGraphqlSubscription} from '@niftgen/useGraphqlSubscription';
import {ADD, REMOVE, useNftCommentsStore} from '@niftgen/useNftComments';
import {useCallback, useMemo} from 'react';
import onNotification from './onNotification.graphql';

const query = compileFragments(onNotification, notificationFragment);
const error = e => console.error(e);

export function useRealtimeNftComments({id: idRaw}) {
  const assetId = parseInt(idRaw);

  const {dispatch} = useNftCommentsStore();

  const next = useCallback(
    ({value}) => {
      const comment = value?.data?.onNotification?.comment;
      if (value?.data?.onNotification?.deletedCommentId && !comment) {
        dispatch({type: REMOVE, assetId, id: value?.data?.onNotification?.deletedCommentId});
        return;
      }
      if (comment?.asset?.id === assetId) {
        dispatch({type: ADD, assetId, comment});
      }
    },
    [assetId, dispatch]
  );
  const params = useMemo(() => ({assetId}), [assetId]);
  const enabled = Boolean(assetId);
  useGraphqlSubscription(query, params, next, error, enabled);
  return null;
}
