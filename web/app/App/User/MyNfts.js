import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import {useTheme} from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Filters, Nft, Pager, useDefaultParams} from '@niftgen/Nfts';
import {useNfts} from '@niftgen/useNfts';
import {useValue} from '@nkbt/react-router';

export function MyNfts() {
  const walletAddress = useValue('user');
  const {limit, offset} = useDefaultParams();
  const assetQuery = {
    limit,
    offset,
    ownedByWalletAddress: walletAddress,
    status: ['VISIBLE'],
  };
  const {data: nfts, isFetching} = useNfts(assetQuery);
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.up('sm'), {noSsr: true});
  const md = useMediaQuery(theme.breakpoints.up('md'), {noSsr: true});
  const lg = useMediaQuery(theme.breakpoints.up('lg'), {noSsr: true});

  return (
    <Box sx={{py: 3, mt: 6, background: 'var(--background-color-secondary)'}}>
      <Container>
        <Grid container spacing={3} sx={{my: 1}}>
          <Filters />
          <Grid container item xs={12} spacing={2}>
            {isFetching
              ? [sm, md, lg].filter(Boolean).map((_, key) => (
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
          <Grid xs={12}>
            <Pager assetQuery={assetQuery} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
