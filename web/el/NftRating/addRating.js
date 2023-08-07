import addRatingQuery from './addRating.graphql';

export async function addRating({fetch, walletAddress, assetId, rating}) {
  const body = await fetch(`/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: addRatingQuery,
      variables: {walletAddress, assetId, rating},
    }),
  });

  const {data, errors} = await body.json();
  if (data?.addRating) {
    return {
      myRating: data?.addRating?.asset?.myRating,
      ratingTotals: data?.addRating?.asset?.ratingTotals,
    };
  }
  throw new Error(errors?.[0]?.message || 'Unknown server error');
}
