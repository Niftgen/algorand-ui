import {fetchAccount, normaliseAccount, saveRef} from '@niftgen/useAccount';

function isExpired({exp}) {
  return exp * 1000 - 60000 <= Date.now();
}

async function safeDecode(token) {
  try {
    const {default: decode} = await import(/* webpackChunkName: "jwt" */ 'jwt-decode');
    return decode(token);
  } catch (error) {
    console.error(error);
    return {};
  }
}

async function prepareToken(walletAddress) {
  if (!walletAddress) {
    return null;
  }

  const token = window.localStorage.getItem('jwt');
  if (!token) {
    return null;
  }
  const decoded = await safeDecode(token);

  if (isExpired(decoded)) {
    //      console.log('Token expired, cleanup from state');
    window.localStorage.removeItem('jwt');
    return null;
  }

  if (decoded.walletAddress !== walletAddress) {
    //      console.log('Token wallet address mismatched, cleanup from state');
    window.localStorage.removeItem('jwt');
    return null;
  }

  return token;
}

export async function prepareAuth({api, apikey, ledger, chainId, magic, ALGOD_SERVER}) {
  const provider = window.localStorage.getItem('provider');

  if (provider === 'Magic') {
    const [{AlgorandExtension}, {Magic: MagicSdk}] = await Promise.all([
      import(/* webpackChunkName: "magic" */ '@magic-ext/algorand'),
      import(/* webpackChunkName: "magic" */ 'magic-sdk'),
    ]);
    window.Magic =
      window.Magic ??
      new MagicSdk(magic, {
        extensions: {
          algorand: new AlgorandExtension({
            rpcUrl: ALGOD_SERVER,
          }),
        },
      });
    const isLoggedIn = await window.Magic.user.isLoggedIn();
    if (isLoggedIn) {
      const meta = await window.Magic.user.getMetadata();
      window.localStorage.setItem('walletAddress', meta.publicAddress);
      window.localStorage.setItem('email', meta.email);
    }
  }

  if (provider === 'PeraWallet') {
    const {PeraWalletConnect} = await import(/* webpackChunkName: "pera" */ '@perawallet/connect');

    window.PeraWallet = window.PeraWallet ?? new PeraWalletConnect({chainId});
    const accounts = await window.PeraWallet.reconnectSession();
    if (!window.localStorage.getItem('walletAddress')) {
      const index = parseInt(window.localStorage.getItem('peraWallet')) || 0;
      if (accounts[index]) {
        window.localStorage.setItem('peraWallet', `${index}`);
        window.localStorage.setItem('walletAddress', accounts[index]);
      } else {
        window.localStorage.setItem('peraWallet', '0');
        window.localStorage.setItem('walletAddress', accounts[0]);
      }
    }
    if (window.PeraWallet.isConnected && window.PeraWallet.connector) {
      window.PeraWallet.connector.on('disconnect', () => {
        window.localStorage.clear();
      });
    }
  }

  if (provider === 'AlgoSigner' && window.AlgoSigner) {
    await window.AlgoSigner.connect({ledger});
  }

  const walletAddress = window.localStorage.getItem('walletAddress');
  const token = await prepareToken(walletAddress);

  const rawAccount = await fetchAccount({api, apikey, token, walletAddress});
  const account = await saveRef({
    api,
    apikey,
    token,
    walletAddress,
    account: normaliseAccount(rawAccount),
  });

  return {account, auth: {provider, walletAddress, token}};
}
