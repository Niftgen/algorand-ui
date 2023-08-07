import {compileFragments} from '@niftgen/compileFragments';
import {accountFragment} from '@niftgen/fragments.account';
import getUserQuery from './getUser.graphql';

export async function fetchAccount({api, apikey, token, walletAddress}) {
  if (!api) {
    return null;
  }
  if (!apikey) {
    return null;
  }
  if (!token) {
    return null;
  }
  if (!walletAddress) {
    return null;
  }

  const response = await window.fetch(`${api}/graphql`, {
    method: 'POST',
    headers: {
      'x-api-key': apikey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: compileFragments(getUserQuery, accountFragment),
      variables: {walletAddress},
    }),
  });
  const {
    data: {getUser: user},
  } = await response.json();
  if (!user) {
    return null;
  }

  return user;
}
