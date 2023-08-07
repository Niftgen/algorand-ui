import {useAuth} from '@niftgen/useAuth';
import {useFetch} from '@niftgen/useFetch';
import {useUpdateNft} from '@niftgen/useNfts';
import {useCallback, useEffect, useRef, useState} from 'react';
import {addRating} from './addRating';

export function useRating(nft) {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [rating, setRating] = useState(nft.myRating);
  useEffect(() => {
    setRating(nft.myRating);
  }, [nft.myRating]);

  const updateNft = useUpdateNft({id: nft.id});

  const {walletAddress} = useAuth();
  const {fetch} = useFetch();

  const onRatingChange = useCallback(
    (_event, value) => {
      setRating(value);

      addRating({fetch, walletAddress, assetId: nft.id, rating: value}).then(
        totals => {
          if (totals && isMounted.current) {
            updateNft({
              id: nft.id,
              ...totals,
            });
          }
        },
        error => {
          console.error(error);
        }
      );
    },
    [nft.id, fetch, walletAddress, updateNft]
  );

  return {rating, onRatingChange};
}
