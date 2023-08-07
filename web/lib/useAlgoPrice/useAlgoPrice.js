import {useConfig} from '@niftgen/useConfig';
import {useQuery} from '@tanstack/react-query';

export async function fetchPrice({txn, id}) {
  const response = await window.fetch(`${txn}/price`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({id}),
  });
  return response.json();
}

export function useAlgoPrice() {
  const {txn} = useConfig();
  return useQuery({
    queryKey: ['price', 'algorand'],
    queryFn: async () => {
      return fetchPrice({txn, id: 'algorand'});
    },
    enabled: true,
    refetchInterval: 120_000,
  });
}
