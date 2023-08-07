import {useConfig} from '@niftgen/useConfig';
import {useQuery} from '@tanstack/react-query';
import algosdk from 'algosdk';

export function decodeKey(key) {
  return Buffer.from(key, 'base64').toString();
}

export function decodeValue(bytes) {
  const maybeAddress = algosdk.encodeAddress(new Uint8Array(Buffer.from(bytes, 'base64')));
  return algosdk.isValidAddress(maybeAddress) ? maybeAddress : Buffer.from(bytes, 'base64').toString();
}

export function decodeAppState(appState) {
  return Object.fromEntries(
    appState.map(({key, value}) => {
      const decodedKey = decodeKey(key);
      if (typeof value === 'object') {
        if ('type' in value && value.type === 1) {
          return [decodedKey, decodeValue(value.bytes)];
        }
        if ('type' in value && value.type === 2) {
          return [decodedKey, value.uint];
        }
        if ('uint' in value) {
          return [decodedKey, value.uint];
        }
        if ('bytes' in value) {
          return [decodedKey, decodeValue(value.bytes)];
        }
      }
      if (typeof value === 'string') {
        return [decodedKey, decodeValue(value)];
      }
      return [decodedKey, undefined];
    })
  );
}

export function getOptinApp({account, appId}) {
  if (!account) {
    return undefined;
  }
  if (!appId) {
    return undefined;
  }
  const app = account['apps-local-state'].find(app => app.id === appId);
  if (!app) {
    return undefined;
  }
  return {
    id: app.id,
    optinRound: app['opted-in-at-round'],
    ...decodeAppState(app['key-value']),
  };
}

export function getCreatedApps({account}) {
  return account['created-apps'].map(app => ({
    id: app.id,
    ...decodeAppState(app.params['global-state']),
  }));
}

function findCreatorApp({account}) {
  if (!account) {
    return undefined;
  }
  return getCreatedApps({account})
    .reverse()
    .find(app => app.MODULE_NAME === 'CREATOR_APP');
}

export function useAlgod() {
  const {ALGOD_AUTH_HEADER, ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT} = useConfig();
  const {data: algod} = useQuery({
    queryKey: ['algod'],
    queryFn: () => {
      if (ALGOD_AUTH_HEADER) {
        return new algosdk.Algodv2({[ALGOD_AUTH_HEADER]: ALGOD_TOKEN}, ALGOD_SERVER, ALGOD_PORT);
      }
      return new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);
    },
    enabled: Boolean(ALGOD_TOKEN !== undefined && ALGOD_SERVER !== undefined && ALGOD_PORT !== undefined),
  });
  return algod;
}

export function useAlgoAccount(walletAddress, options) {
  const algod = useAlgod();

  return useQuery({
    queryKey: ['algo', walletAddress],
    queryFn: async () => {
      const account = await algod.accountInformation(walletAddress).do();
      return account;
    },
    enabled: Boolean(algod && algosdk.isValidAddress(walletAddress)),
    refetchInterval: 20_000,
    refetchType: 'active',
    ...options,
  });
}

const subscriptionAppStateDefault = {
  subscriptionAppId: 0,
  creatorAddress: null,
  optin: false,
  subscribed: false,
  expiryDate: null,
  activeSubscription: false,
  amount: 0,
  duration: 0,
};

export function transformSubscriptionAppState(state) {
  const expiryDate = state.SUBSCRIPTION_EXPIRES_DATE > 0 ? new Date(state.SUBSCRIPTION_EXPIRES_DATE * 1000) : null;
  return {
    ...subscriptionAppStateDefault,
    subscriptionAppId: state.id,
    creatorAddress: state.CREATOR_ADDRESS,
    optin: Boolean(state),
    subscribed: state.SUBSCRIPTION_STATUS === 1,
    expiryDate,
    activeSubscription: expiryDate && expiryDate.getTime() > Date.now(),
    amount: state.SUBSCRIPTION_AMOUNT_PAID,
    paymentType: state.SUBSCRIPTION_PAYMENT_TYPE,
    duration: state.SUBSCRIPTION_DURATION,
  };
}

export function getSubscriptionAppStateById(subscriptionAppId, userAlgoAccount) {
  if (!subscriptionAppId || !userAlgoAccount) {
    return subscriptionAppStateDefault;
  }
  const state = getOptinApp({account: userAlgoAccount, appId: subscriptionAppId});
  return state ? transformSubscriptionAppState(state) : subscriptionAppStateDefault;
}

const subscriptionModuleStateDefault = {
  subscriptionModuleId: 0,
  subscriptionAppId: 0,
  optin: false,
};

export function transformSubscriptionModuleState(state) {
  return {
    ...subscriptionModuleStateDefault,
    subscriptionModuleId: state.id,
    subscriptionAppId: state.SUBSCRIPTION_APP_ID ?? 0,
    optin: Boolean(state.id),
  };
}

export function getSubscriptionModuleState(subscriptionModuleId, creatorAlgoAccount) {
  if (!subscriptionModuleId || !creatorAlgoAccount) {
    return subscriptionModuleStateDefault;
  }
  const state = getOptinApp({account: creatorAlgoAccount, appId: subscriptionModuleId});
  return state ? transformSubscriptionModuleState(state) : subscriptionModuleStateDefault;
}

const APP_STATE = [
  'CREATOR_ADDRESS',
  'SUBSCRIPTION_AMOUNT_PAID',
  'SUBSCRIPTION_EXPIRES_DATE',
  'SUBSCRIPTION_PAYMENT_TYPE',
  'SUBSCRIPTION_STATUS',
  'SUBSCRIPTION_DURATION',
];

const STATE_KEYS = APP_STATE.map(prop => Buffer.from(prop).toString('base64'))
  .sort()
  .join('|');

export function getAllSubscriptionAppState(userAlgoAccount) {
  if (!userAlgoAccount || !userAlgoAccount['apps-local-state']) {
    return [];
  }
  return userAlgoAccount['apps-local-state']
    .filter(
      app =>
        Array.isArray(app['key-value']) &&
        app['key-value'].length === 6 &&
        app['key-value']
          .map(({key}) => key)
          .sort()
          .join('|') === STATE_KEYS
    )
    .map(app => ({
      id: app.id,
      ...decodeAppState(app['key-value']),
    }))
    .map(transformSubscriptionAppState);
}

export function useKyc(walletAddress) {
  const {ADMIN_ID} = useConfig();
  const creatorAlgoAccount = useAlgoAccount(walletAddress);
  const adminModuleState = getOptinApp({account: creatorAlgoAccount.data, appId: ADMIN_ID});

  return {
    isLoading: creatorAlgoAccount.isLoading,
    data: {
      optin: creatorAlgoAccount.isFetched && Boolean(adminModuleState),
      kyc: adminModuleState?.STATUS === 1,
    },
  };
}
