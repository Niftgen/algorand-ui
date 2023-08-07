import {useFetch} from '@niftgen/useFetch';
import {useQuery} from '@tanstack/react-query';
import getReferralWalletQuery from './getReferralWallet.graphql';

async function fetchReferralWallet({fetch, referralCode}) {
  const body = await fetch(`/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: getReferralWalletQuery,
      variables: {referralCode},
    }),
  });

  const {data, errors} = await body.json();
  if (data?.getUser?.walletAddress) {
    return data?.getUser?.walletAddress;
  }
  throw new Error(errors?.[0]?.message || 'Unknown server error');
}

export function useReferralWallet({referralCode}) {
  const {fetch} = useFetch();
  return useQuery({
    queryKey: ['referralWallet', referralCode],
    queryFn: () => fetchReferralWallet({fetch, referralCode}),
    enabled: Boolean(fetch && referralCode),
  });
}
