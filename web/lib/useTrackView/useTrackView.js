import {compileFragments} from '@niftgen/compileFragments';
import {assetFragment} from '@niftgen/fragments.asset';
import {useAuth} from '@niftgen/useAuth';
import {useFetch} from '@niftgen/useFetch';
import {useNft} from '@niftgen/useNfts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useEffect, useRef} from 'react';

const gql = ([q]) => q;

export function useTrackView({id: idRaw}) {
  const id = parseInt(idRaw);
  const {fetch} = useFetch();
  const {walletAddress} = useAuth();
  const {data: nft} = useNft({id});
  const called = useRef(false);
  const queryClient = useQueryClient();
  const {mutate} = useMutation({
    mutationKey: ['viewedAsset', {id}],
    mutationFn: async function viewedAsset() {
      if (called.current) {
        return null;
      }
      called.current = true;
      const query = compileFragments(
        gql`
          mutation viewedAsset($walletAddress: String!, $id: Int!) {
            viewedAsset(walletAddress: $walletAddress, id: $id) {
              ...asset
            }
          }
        `,
        assetFragment
      );
      const variables = {walletAddress, id};
      const body = await fetch(`/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({query, variables}),
      });

      const {data, errors} = await body.json();
      if (data?.viewedAsset) {
        return data?.viewedAsset;
      }
      throw new Error(errors?.[0]?.message || 'Unknown server error');
    },
    cacheTime: Infinity,
    onSuccess: asset => {
      if (asset) {
        queryClient.setQueriesData(['nft', id], asset);
        queryClient.setQueriesData(['nfts'], oldAssets =>
          oldAssets ? oldAssets.map(oldAsset => (oldAsset.id === id ? asset : oldAsset)) : oldAssets
        );
      }
    },
  });

  useEffect(() => {
    if (nft.owner.walletAddress && walletAddress && nft.owner.walletAddress !== walletAddress) {
      mutate();
    }
  }, [mutate, nft.owner.walletAddress, walletAddress]);
}
