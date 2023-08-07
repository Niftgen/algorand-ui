import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Unstable_Grid2';
import {Nft} from '@niftgen/Nfts';
import {useNfts} from '@niftgen/useNfts';
import {useHref, useNavigate} from '@nkbt/react-router';
import PropTypes from 'prop-types';
import {useCallback} from 'react';

export function ExploreAllButton() {
  const navigate = useNavigate();
  const hrefExplore = useHref({page: 'videos'});
  const onClickExplore = useCallback(() => {
    navigate({page: 'videos'});
  }, [navigate]);

  return (
    <Button
      href={hrefExplore}
      size="large"
      variant="outlined"
      onClick={onClickExplore}
      sx={{
        display: 'inline-block',
        mx: 'auto',
      }}>
      Explore all videos
    </Button>
  );
}

export function Browse({kind}) {
  const {data: nfts, isFetching} = useNfts({
    limit: 6,
    offset: 0,
    status: ['VISIBLE'],
    kind,
    sort: 'MOST_VIEWED',
  });

  return (
    <Grid container xs={12} spacing={2} sx={{pb: 8}}>
      {isFetching
        ? [1, 2, 3, 4, 5, 6].map((_, key) => (
            <Grid key={key} xs={12} sm={12} md={6} lg={4}>
              <Skeleton variant="rounded" height={160} />
            </Grid>
          ))
        : nfts.map(nft => (
            <Grid key={nft.id} xs={12} sm={12} md={6} lg={4}>
              <Nft nft={nft} />
            </Grid>
          ))}
    </Grid>
  );
}

Browse.propTypes = {
  kind: PropTypes.arrayOf(PropTypes.oneOf(['VIDEO', 'FREE_VIDEO']).isRequired).isRequired,
};
