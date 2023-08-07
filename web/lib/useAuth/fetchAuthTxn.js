import query from './authenticate.graphql';

export async function fetchAuthTxn({api, apikey, walletAddress}) {
  const response = await window.fetch(`${api}/graphql`, {
    method: 'POST',
    headers: {
      'x-api-key': apikey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {walletAddress},
    }),
  });
  if (!response.ok) {
    throw new Error('Authorisation failed');
  }
  const {data, errors} = await response.json();
  if (errors?.[0]?.message) {
    throw new Error(errors?.[0]?.message);
  }

  if (data?.authenticate?.data) {
    try {
      const {jwt, txn} = JSON.parse(data?.authenticate?.data);
      return {jwt, txn};
    } catch (e) {
      console.error(e);
    }
  }
  throw new Error('Authorisation failed');
}
