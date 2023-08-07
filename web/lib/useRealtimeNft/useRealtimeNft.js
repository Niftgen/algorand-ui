import {compileFragments} from '@niftgen/compileFragments';
import {notificationFragment} from '@niftgen/fragments.notification';
import {useGraphqlSubscription} from '@niftgen/useGraphqlSubscription';
import {useQueryClient} from '@tanstack/react-query';
import {useCallback, useMemo} from 'react';
import onNotification from './onNotification.graphql';

const query = compileFragments(onNotification, notificationFragment);
const error = e => console.error(e);

export function useRealtimeNft({id: idRaw}) {
  const assetId = parseInt(idRaw);

  const queryClient = useQueryClient();

  const next = useCallback(
    ({value}) => {
      const asset = value?.data?.onNotification?.asset;
      if (assetId !== asset?.id) {
        return;
      }
      switch (value?.data?.onNotification?.notificationType) {
        case 'RATING': {
          queryClient.setQueriesData(['nfts'], oldAssets => {
            if (oldAssets) {
              return oldAssets.map(oldAsset => {
                if (oldAsset.id !== assetId) {
                  return oldAsset;
                }
                return {
                  ...oldAsset,
                  ratingTotals: asset.ratingTotals,
                };
              });
            }
          });
          queryClient.setQueriesData(['nft', assetId], oldAsset => {
            if (oldAsset) {
              return {
                ...oldAsset,
                ratingTotals: asset.ratingTotals,
              };
            }
          });
          return;
        }
        case 'PURCHASE':
        case 'SALE':
        case 'WON':
        case 'BID': {
          if (assetId === asset?.id) {
            queryClient.setQueriesData(['nfts'], oldAssets => {
              if (oldAssets) {
                return oldAssets.map(oldAsset => {
                  if (oldAsset.id !== assetId) {
                    return oldAsset;
                  }
                  return {
                    ...oldAsset,
                    ...asset,
                  };
                });
              }
            });
            queryClient.setQueriesData(['nft', assetId], oldAsset => {
              if (oldAsset) {
                return {
                  ...oldAsset,
                  ...asset,
                };
              } else {
                return asset;
              }
            });
          }
          return;
        }
        case 'COMMENT':
        case 'MESSAGE':
        default:
          return;
      }
    },
    [assetId, queryClient]
  );
  const params = useMemo(() => ({assetId}), [assetId]);
  const enabled = Boolean(assetId);
  useGraphqlSubscription(query, params, next, error, enabled);

  return null;
}
