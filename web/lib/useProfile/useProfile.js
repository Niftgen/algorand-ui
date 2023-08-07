import {compileFragments} from '@niftgen/compileFragments';
import {accountFragment} from '@niftgen/fragments.account';
import {initialState, normaliseMetadata} from '@niftgen/useAccount';
import {useFetch} from '@niftgen/useFetch';
import {useQuery} from '@tanstack/react-query';
import {useMemo} from 'react';
import getUserQuery from './getUser.graphql';

async function fetchUser({fetch, walletAddress}) {
  const body = await fetch(`/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: compileFragments(getUserQuery, accountFragment),
      variables: {walletAddress},
    }),
  });

  const {data, errors} = await body.json();
  if (data?.getUser) {
    return data?.getUser;
  }
  throw new Error(errors?.[0]?.message || 'Unknown server error');
}

function select(profile) {
  const metadata = normaliseMetadata(profile);
  return Object.assign(profile, {metadata});
}

export function useProfile({walletAddress}) {
  const {fetch} = useFetch();
  const {data, ...rest} = useQuery({
    queryKey: ['profile', walletAddress],
    queryFn: () => fetchUser({fetch, walletAddress}),
    enabled: Boolean(fetch && walletAddress),
  });

  return {
    data: useMemo(() => (data ? select(data) : initialState), [data]),
    ...rest,
  };
}
