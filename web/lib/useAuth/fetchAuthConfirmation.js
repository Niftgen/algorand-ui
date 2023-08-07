import query from './authenticate.graphql';

export async function fetchAuthConfirmation({api, apikey, jwt, txn}) {
  const response = await window.fetch(`${api}/graphql`, {
    method: 'POST',
    headers: {
      'x-api-key': apikey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {transaction: txn},
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
      const {jwt: verifiedJwt} = JSON.parse(data?.authenticate?.data);
      if (verifiedJwt && jwt === verifiedJwt) {
        return {jwt};
      }
    } catch (e) {
      console.error(e);
      throw new Error('Token mismatch');
    }
  }
  throw new Error('Authorisation failed');
}
