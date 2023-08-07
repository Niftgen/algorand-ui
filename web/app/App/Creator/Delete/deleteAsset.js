import deleteAssetQuery from './deleteAsset.graphql';

export async function deleteAsset({fetch, ownerAddress, id}) {
  const body = await fetch(`/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: deleteAssetQuery,
      variables: {
        ownerAddress,
        id,
      },
    }),
  });

  const {data, errors} = await body.json();
  if (data?.deleteAsset) {
    return data?.deleteAsset;
  }
  throw new Error(errors?.[0]?.message || 'Unknown server error');
}
