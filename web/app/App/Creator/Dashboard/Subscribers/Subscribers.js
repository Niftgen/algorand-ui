import Typography from '@mui/material/Typography';
import {getSubscriptionModuleState, useAlgoAccount} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import {useQuery} from '@tanstack/react-query';

async function fetchSubscriptionTransactions({ALGOD_INDEXER, NIFTGEN_ADDRESS, subscriptionAppId, next}) {
  const url = new URL(`${ALGOD_INDEXER}/v2/transactions`);
  url.searchParams.append('note-prefix', 'Uw=='); // "S", "Subscribe"
  url.searchParams.append('address', NIFTGEN_ADDRESS);
  url.searchParams.append('application-id', subscriptionAppId);
  if (next) {
    url.searchParams.append('next', next);
  }

  const response = await window.fetch(url, {
    method: 'GET',
    headers: {Accept: 'application/json'},
  });
  return await response.json();
}

export function Subscribers() {
  const {ALGOD_INDEXER, NIFTGEN_ADDRESS, SUBSCRIPTION_MODULE_ID} = useConfig();

  const {walletAddress: creatorWallet} = useAuth();
  const creatorAlgoAccount = useAlgoAccount(creatorWallet);
  const subscriptionModuleState = getSubscriptionModuleState(SUBSCRIPTION_MODULE_ID, creatorAlgoAccount.data);

  const subscriptionAppId = subscriptionModuleState.subscriptionAppId;

  const {data} = useQuery({
    queryKey: ['subscribers', {creatorWallet}, {subscriptionAppId}],
    queryFn: async () => {
      const all = [];
      let next = undefined;
      do {
        const data = await fetchSubscriptionTransactions({ALGOD_INDEXER, NIFTGEN_ADDRESS, subscriptionAppId, next});
        if (data.transactions.length > 0) {
          next = data['next-token'];
        } else {
          next = undefined;
        }
        all.push(...data.transactions);
      } while (next);
      return all;
    },
    enabled: Boolean(ALGOD_INDEXER && NIFTGEN_ADDRESS && creatorWallet && subscriptionAppId),
  });
  return <Typography>Subscribers count: {data?.length ?? '~'}</Typography>;
}
