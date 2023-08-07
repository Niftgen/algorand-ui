export async function storjPut({txn, token, walletAddress, type}) {
  const response = await window.fetch(`${txn}/storjPut`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({walletAddress, type}),
  });
  if (response.status !== 200) {
    throw new Error(`Cannot generate Storj PUT URL ${await response.text()}`);
  }
  return response.text();
}
