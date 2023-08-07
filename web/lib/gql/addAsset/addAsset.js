import {compileFragments} from '@niftgen/compileFragments';
import {assetFragment} from '@niftgen/fragments.asset';
import addAssetQuery from './addAsset.graphql';

const query = compileFragments(addAssetQuery, assetFragment);

export async function addAsset({
  fetch,
  categories,
  cover,
  description,
  duration,
  filePath,
  ipfsPath,
  kind,
  metadata,
  name,
  ownerAddress,
}) {
  const variables = {
    categories,
    cover,
    description,
    duration,
    filePath,
    ipfsPath,
    kind,
    metadata,
    name,
    ownerAddress,
  };
  const body = await fetch(`/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({query, variables}),
  });

  const {data, errors} = await body.json();
  if (data?.addAsset) {
    return data?.addAsset;
  }
  throw new Error(errors?.[0]?.message || 'Unknown server error');
}
