import {compileFragments} from '@niftgen/compileFragments';
import {accountFragment} from '@niftgen/fragments.account';
import saveMetadataQuery from './saveMetadata.graphql';

const query = compileFragments(saveMetadataQuery, accountFragment);

export async function saveMetadata({api, apikey, token, walletAddress, metadata}) {
  if (!(api && apikey && token && walletAddress)) {
    return;
  }
  const variables = {
    walletAddress,
    metadata: JSON.stringify(metadata),
  };
  const response = await window.fetch(`${api}/graphql`, {
    method: 'POST',
    headers: {
      'x-api-key': apikey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({query, variables}),
  });

  const {data, errors} = await response.json();
  if (data?.editUser) {
    return data?.editUser;
  }
  throw new Error(errors?.[0]?.message || 'Unknown server error');
}
