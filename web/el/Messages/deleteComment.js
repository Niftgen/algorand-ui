import deleteCommentQuery from './deleteComment.graphql';

export async function deleteComment({fetch, walletAddress, id}) {
  const body = await fetch(`/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: deleteCommentQuery,
      variables: {walletAddress, id},
    }),
  });

  const {data, errors} = await body.json();
  if (data?.deleteComment) {
    return data?.deleteComment;
  }
  throw new Error(errors?.[0]?.message || 'Unknown server error');
}
