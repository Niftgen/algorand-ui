import deleteNotificationQuery from './deleteNotification.graphql';

export async function deleteNotification({fetch, walletAddress, id}) {
  const body = await fetch(`/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: deleteNotificationQuery,
      variables: {
        walletAddress,
        id,
      },
    }),
  });

  const {data, errors} = await body.json();
  if (data?.deleteNotification) {
    return data?.deleteNotification;
  }
  throw new Error(errors?.[0]?.message || 'Unknown server error');
}
