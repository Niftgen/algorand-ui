import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useCallback} from 'react';
import {select} from './select';

export function useNftSold() {
  const queryClient = useQueryClient();

  const {data: nft} = useQuery({
    queryKey: ['nft', 'sold'],
    queryFn: () => null,
  });

  const sold = useCallback(nft => queryClient.setQueryData(['nft', 'sold'], select(nft)), [queryClient]);

  const clear = useCallback(() => queryClient.invalidateQueries(['nft', 'sold']), [queryClient]);

  return {
    nft,
    sold,
    clear,
  };
}
