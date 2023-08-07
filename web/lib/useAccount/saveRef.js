import {saveMetadata} from './saveMetadata';

export async function saveRef({api, apikey, token, walletAddress, account}) {
  if (account) {
    const search = new URLSearchParams(document.location.search);
    const referralCode = search.get('ref');
    if (referralCode && referralCode !== account.referralCode) {
      try {
        const metadata = {
          ...account.metadata,
          ref: {
            code: referralCode,
            createdAt: new Date(),
          },
        };
        return await saveMetadata({api, apikey, token, walletAddress, metadata});
      } catch (e) {
        console.error(e);
        // do nothing, just carry on
      }
    }
  }
  return account;
}
