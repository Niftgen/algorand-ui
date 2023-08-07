export async function storjGet({txn, token, walletAddress, key}) {
  const response = await window.fetch(`${txn}/storjGet`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({walletAddress, key}),
  });
  if (response.status !== 200) {
    const text = await response.text();
    throw new Error(text);
  }
  return response.text();
}
