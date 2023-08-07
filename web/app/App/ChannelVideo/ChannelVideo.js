import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import {useNftCommentsFetcher} from '@niftgen/useNftComments';
import {useRealtimeNft} from '@niftgen/useRealtimeNft';
import {useRealtimeNftComments} from '@niftgen/useRealtimeNftComments';
import {useTrackView} from '@niftgen/useTrackView';
import {useNavigate, useRemove, useValue} from '@nkbt/react-router';
import {useEffect} from 'react';
import {AdditionalInfo} from './AdditionalInfo';
import {Comments} from './Comments';
import {Main} from './Main';
import {OtherNfts} from './OtherNfts';

export function ChannelVideo() {
  const id = useValue('video');
  useTrackView({id});

  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate({page: 'browse'});
    }
  }, [navigate, id]);

  useNftCommentsFetcher({id});
  useRealtimeNft({id});
  useRealtimeNftComments({id});

  const removeParams = useRemove();
  useEffect(
    () => () => {
      if (process.env.NODE_ENV !== 'development') {
        removeParams({nft: null});
      }
    },
    [removeParams]
  );

  useEffect(() => {
    window.scrollTo({top: 0});
  }, [id]);

  return (
    <Container component="main" sx={{py: 3}}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Main />
        </Grid>
        <Grid xs={12} md={7}>
          <AdditionalInfo />
          <Divider sx={{my: 4}} />
          <Comments />
        </Grid>
        <Grid xs={12} md={5}>
          <OtherNfts />
        </Grid>
      </Grid>
    </Container>
  );
}
