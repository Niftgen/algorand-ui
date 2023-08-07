import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import {Nft} from '@niftgen/Nfts';
import {useNft, useNfts} from '@niftgen/useNfts';

import {useValue} from '@nkbt/react-router';

export function OtherNfts() {
  const id = parseInt(useValue('video'));
  const {data: currentNft} = useNft({id});

  const assetQuery = {
    enabled: Boolean(currentNft.owner.walletAddress),
    limit: 12,
    offset: 0,
    status: ['VISIBLE'],
    kind: ['VIDEO', 'FREE_VIDEO'],
    ownedByWalletAddress: currentNft.owner.walletAddress,
  };
  const {data: nfts} = useNfts(assetQuery);

  const otherNfts = nfts.filter(nft => nft.id !== currentNft.id);
  if (otherNfts.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h5">More from {currentNft.owner.userName}</Typography>
      <Grid container item xs={12} spacing={2}>
        {otherNfts.map(nft => (
          <Grid key={nft.id} xs={12} sm={6} md={12}>
            <Nft nft={nft} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
