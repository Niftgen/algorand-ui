import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import {useAuth} from '@niftgen/useAuth';
import PropTypes from 'prop-types';
import {useState} from 'react';
import {useRating} from './useRating';

export function NftRating({nft}) {
  const {walletAddress} = useAuth();
  const {rating, onRatingChange} = useRating(nft);
  const [ratingHover, setRatingHover] = useState(false);

  return (
    <Stack direction="row" alignItems="center" spacing={3}>
      {rating ? (
        <Rating name="rating" value={rating} onChange={onRatingChange} />
      ) : (
        <Rating
          name="rating"
          onMouseEnter={() => setRatingHover(true)}
          onMouseLeave={() => setRatingHover(false)}
          precision={nft.owner.walletAddress === walletAddress || !ratingHover ? 0.5 : 1}
          value={nft.ratingTotals.averageRating}
          onChange={onRatingChange}
          readOnly={nft.owner.walletAddress === walletAddress}
        />
      )}
      {nft.owner.walletAddress === walletAddress ? (
        <Button>
          {nft.ratingTotals.ratingCount} {nft.ratingTotals.ratingCount === 1 ? 'rating' : 'ratings'}
        </Button>
      ) : (
        <Tooltip
          arrow
          placement="top"
          title={<Rating name="rating" readOnly precision={0.5} value={nft.ratingTotals.averageRating} />}>
          <Button>
            {nft.ratingTotals.ratingCount} {nft.ratingTotals.ratingCount === 1 ? 'rating' : 'ratings'}
          </Button>
        </Tooltip>
      )}
    </Stack>
  );
}

NftRating.propTypes = {
  nft: PropTypes.shape({
    id: PropTypes.number.isRequired,
    ratingTotals: PropTypes.shape({
      ratingCount: PropTypes.number,
      averageRating: PropTypes.number,
    }),
    owner: PropTypes.shape({
      walletAddress: PropTypes.string,
    }),
  }).isRequired,
};
