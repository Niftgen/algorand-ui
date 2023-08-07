export const supportPages = Object.fromEntries(
  Object.entries({
    'What is Niftgen': 'What-is-Niftgen',
    'Why Should Video Creators Use Niftgen': 'Why-Should-Video-Creators-Use-Niftgen',
    'What is Blockchain': 'What-is-Blockchain',
    'Web 1.0 vs Web 2.0 vs Web 3.0': 'Web-1.0-vs-Web-2.0-vs-Web-3.0',
    'What is an NFT?': 'What-is-an-NFT',
    'What is a crypto wallet?': 'What-is-a-crypto-wallet',
    'Buying Algos directly from Pera Wallet': 'Buying-Algos-directly-from-Pera-Wallet',
    'Buying Algos directly from MyAlgo Wallet': 'Buying-Algos-directly-from-MyAlgo-Wallet',
    'How to Create Accounts on Crypto Exchanges Coinbase & Kraken':
      'Create-Accounts-on-Crypto-Exchanges-Coinbase-and-Kraken',
    'Buying ALGO from Coinbase and Kraken': 'Buying-ALGO-from-Coinbase-and-Kraken',
    'Transferring ALGO to your wallet': 'Transferring-ALGO-to-your-wallet',
    'Wallet set up: MyAlgo Wallet': 'Wallet-set-up-MyAlgo-Wallet',
    'Wallet set up: Pera Wallet': 'Wallet-set-up-Pera-Wallet',
  }).map(([displayText, support]) => [support, displayText])
);

export async function loadPages() {
  return {
    'Blockchain-Basics': await import(/* webpackChunkName: "support"*/ './src/Blockchain-Basics.md'),
    'Buying-ALGO-from-Coinbase-and-Kraken': await import(
      /* webpackChunkName: "support"*/ './src/Buying-ALGO-from-Coinbase-and-Kraken.md'
    ),
    'Buying-Algos-directly-from-MyAlgo-Wallet': await import(
      /* webpackChunkName: "support"*/ './src/Buying-Algos-directly-from-MyAlgo-Wallet.md'
    ),
    'Buying-Algos-directly-from-Pera-Wallet': await import(
      /* webpackChunkName: "support"*/ './src/Buying-Algos-directly-from-Pera-Wallet.md'
    ),
    'Create-Accounts-on-Crypto-Exchanges-Coinbase-and-Kraken': await import(
      /* webpackChunkName: "support"*/ './src/Create-Accounts-on-Crypto-Exchanges-Coinbase-and-Kraken.md'
    ),
    'History-of-Blockchain-Technology': await import(
      /* webpackChunkName: "support"*/ './src/History-of-Blockchain-Technology.md'
    ),
    Home: await import(/* webpackChunkName: "support"*/ './src/Home.md'),
    'Privacy-Policy': await import(/* webpackChunkName: "support"*/ './src/Privacy-Policy.md'),
    'Terms-of-Service': await import(/* webpackChunkName: "support"*/ './src/Terms-of-Service.md'),
    'Transferring-ALGO-to-your-wallet': await import(
      /* webpackChunkName: "support"*/ './src/Transferring-ALGO-to-your-wallet.md'
    ),
    'Video-Tutorials': await import(/* webpackChunkName: "support"*/ './src/Video-Tutorials.md'),
    'Wallet-set-up-MyAlgo-Wallet': await import(
      /* webpackChunkName: "support"*/ './src/Wallet-set-up-MyAlgo-Wallet.md'
    ),
    'Wallet-set-up-Pera-Wallet': await import(/* webpackChunkName: "support"*/ './src/Wallet-set-up-Pera-Wallet.md'),
    'Web-1.0-vs-Web-2.0-vs-Web-3.0': await import(
      /* webpackChunkName: "support"*/ './src/Web-1.0-vs-Web-2.0-vs-Web-3.0.md'
    ),
    'What-is-a-crypto-wallet': await import(/* webpackChunkName: "support"*/ './src/What-is-a-crypto-wallet.md'),
    'What-is-an-NFT': await import(/* webpackChunkName: "support"*/ './src/What-is-an-NFT.md'),
    'What-is-Blockchain': await import(/* webpackChunkName: "support"*/ './src/What-is-Blockchain.md'),
    'What-is-Niftgen': await import(/* webpackChunkName: "support"*/ './src/What-is-Niftgen.md'),
    'What-is-Niftgen-2': await import(/* webpackChunkName: "support"*/ './src/What-is-Niftgen-2.md'),
    'Why-Should-Video-Creators-Use-Niftgen': await import(
      /* webpackChunkName: "support"*/ './src/Why-Should-Video-Creators-Use-Niftgen.md'
    ),
  };
}
