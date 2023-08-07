import {compileFragments} from '@niftgen/compileFragments';
import {assetFragment} from '@niftgen/fragments.asset';
import {transactionFragment} from '@niftgen/fragments.transaction';
import {useAuth} from '@niftgen/useAuth';
import {useFetch} from '@niftgen/useFetch';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useCallback, useMemo} from 'react';
import getAssetQuery from './getAsset.graphql';
import {placeholderData} from './placeholderData';
import {select} from './select';

export async function getAsset({fetch, id, walletAddress}) {
  const body = await fetch(`/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: compileFragments(getAssetQuery, assetFragment, transactionFragment),
      variables: {
        id,
        walletAddress,
      },
    }),
  });

  const {data, errors} = await body.json();
  if (data?.getAsset) {
    return data?.getAsset;
  }
  throw new Error(errors?.[0]?.message || 'Unknown server error');
}

export function useNft({id: idRaw}) {
  const id = parseInt(idRaw);

  const {walletAddress} = useAuth();
  const {fetch} = useFetch();

  const queryClient = useQueryClient();

  const {data, ...rest} = useQuery({
    queryKey: ['nft', id],
    queryFn: async () => getAsset({fetch, id, walletAddress}),
    onSuccess: asset => {
      queryClient.setQueriesData(['nfts'], oldAssets => {
        if (oldAssets) {
          return oldAssets.map(oldAsset => (oldAsset.id === id ? asset : oldAsset));
        }
      });
    },
    enabled: Boolean(walletAddress && fetch && id),
  });

  return {
    data: useMemo(() => (data ? select(data) : placeholderData), [data]),
    ...rest,
  };
}

export function useUpdateNft({id: idRaw}) {
  const id = parseInt(idRaw);

  const queryClient = useQueryClient();
  return useCallback(
    asset => {
      queryClient.setQueriesData(['nft', id], oldAsset => {
        if (oldAsset) {
          return {
            ...oldAsset,
            ...asset,
          };
        } else {
          return asset;
        }
      });

      queryClient.setQueriesData(['nfts'], oldAssets => {
        if (oldAssets) {
          return oldAssets.map(oldAsset =>
            oldAsset.id === id
              ? {
                  ...oldAsset,
                  ...asset,
                }
              : oldAsset
          );
        }
      });
    },
    [id, queryClient]
  );
}

export function useRemoveNft({id: idRaw}) {
  const id = parseInt(idRaw);

  const queryClient = useQueryClient();
  return useCallback(() => {
    queryClient.removeQueries(['nft', id], {exact: true});
    queryClient.setQueriesData(['nfts'], oldAssets => {
      if (oldAssets) {
        return oldAssets.filter(oldAsset => oldAsset.id !== id);
      }
    });
  }, [id, queryClient]);
}
