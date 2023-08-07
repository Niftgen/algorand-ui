import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import {useQuery} from '@tanstack/react-query';

export async function video({txn, token, walletAddress, id}) {
  const response = await window.fetch(`${txn}/video`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({walletAddress, id}),
  });
  if (response.status !== 200) {
    const text = await response.text();
    throw new Error(text);
  }
  return response.text();
}

export function useVideo({id}) {
  const {txn} = useConfig();
  const {token, walletAddress} = useAuth();
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => video({txn, token, walletAddress, id}),
    enabled: Boolean(txn && token && walletAddress && id),
    retry: 0,
  });
}
