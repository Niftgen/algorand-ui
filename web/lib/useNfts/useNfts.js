import {compileFragments} from '@niftgen/compileFragments';
import {assetFragment} from '@niftgen/fragments.asset';
import {useFilters} from '@niftgen/Nfts';
import {useAccount} from '@niftgen/useAccount';
import {useAuth} from '@niftgen/useAuth';
import {useFetch} from '@niftgen/useFetch';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useMemo} from 'react';
import getAssetsQuery from './getAssets.graphql';
import {select} from './select';

const query = compileFragments(getAssetsQuery, assetFragment);

async function getAssets({fetch, categories, kind, limit, offset, ownedByWalletAddress, sort, status, walletAddress}) {
  const variables = {
    categories,
    kind,
    limit,
    offset,
    ownedByWalletAddress,
    sort,
    status,
    walletAddress,
  };
  const body = await fetch(`/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({query, variables}),
  });
  const {data, errors} = await body.json();
  if (data?.getAssets) {
    return data?.getAssets;
  }
  throw new Error(errors?.[0]?.message || 'Unknown server error');
}

const SORT_MAP = {
  ['createdAt']: 'LATEST_ADDED',
  ['price']: 'PRICE_HL',
  ['-price']: 'PRICE_LH',
  ['rating']: 'TOP_RATED',
  ['views']: 'MOST_VIEWED',
};

const KIND_MAP = {
  ['subs']: 'VIDEO',
  ['free']: 'FREE_VIDEO',
};

export const useNfts = ({
  enabled = true,
  limit,
  offset,
  ownedByWalletAddress,
  status,
  categories: predefinedCategories,
  sort: predefinedSort,
  kind: predefinedKind,
} = {}) => {
  const {walletAddress} = useAuth();
  const {account} = useAccount();
  const {fetch} = useFetch();
  const {category: currentCategories, sort: currentSort, kind: currentKind} = useFilters();

  const categories = predefinedCategories
    ? predefinedCategories
    : currentCategories?.length > 0
    ? currentCategories
    : undefined;
  const sort = predefinedSort ? predefinedSort : currentSort in SORT_MAP ? SORT_MAP[currentSort] : 'LATEST_ADDED';
  const kind = predefinedKind ? predefinedKind : currentKind in KIND_MAP ? [KIND_MAP[currentKind]] : ['VIDEO'];

  const queryClient = useQueryClient();

  const {data, ...rest} = useQuery({
    queryKey: [
      'nfts',
      {
        categories: categories?.sort(),
        kind: kind?.sort(),
        ownedByWalletAddress,
        status: status?.sort(),
      },
      {sort, limit, offset},
    ],
    queryFn: async () =>
      getAssets({
        fetch,
        categories,
        kind,
        limit,
        offset,
        ownedByWalletAddress,
        sort,
        status,
        walletAddress,
      }),
    onSuccess: page => {
      page.forEach(nft => queryClient.setQueryData(['nft', nft.id], nft));
    },
    enabled: Boolean(enabled && walletAddress && fetch && account.id > 0),
  });

  return {
    data: useMemo(() => (data ? data.map(select) : []), [data]),
    ...rest,
  };
};
