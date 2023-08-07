import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/system';
import {AlgoLink} from '@niftgen/AlgoLink';
import {useIpfs} from '@niftgen/useIpfs';
import {useNftSold} from '@niftgen/useNfts';
import {UserLink} from '@niftgen/UserLink';
import PropTypes from 'prop-types';
import {useCallback} from 'react';

const Img = styled('img')(({theme}) =>
  theme.unstable_sx({
    width: {sm: 'auto', xs: '100%'},
    height: {sm: '100%', xs: 'auto'},
    objectFit: 'contain',
    display: 'block',
  })
);

export function AuctionEnd({nft, onCancel, onSuccess}) {
  const {gateway} = useIpfs();

  const onSubmit = useCallback(
    event => {
      event.preventDefault();
      onSuccess();
    },
    [onSuccess]
  );

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: {lg: '50%', md: '70%', sm: '90%', xs: '90%'},
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 2,
      }}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2}}>
        <Typography variant="h5" component="h2">
          Auction completed
        </Typography>
        <IconButton onClick={onCancel}>
          <ClearOutlinedIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box
        component="form"
        noValidate
        onSubmit={onSubmit}
        sx={{backgroundColor: 'background.paper', p: 3, maxHeight: '90vh', overflowY: 'auto', borderRadius: 2}}>
        <Grid container columnSpacing={2}>
          <Grid item xs={4}>
            <Paper elevation={4} sx={{flexGrow: 1, borderRadius: 2, overflow: 'hidden'}}>
              <Img
                alt={nft.name}
                src={gateway(nft.cover)}
                sx={{maxWidth: '100%', maxHeight: '100%', textAlign: 'center', objectFit: 'contain', mx: 'auto'}}
              />
            </Paper>
          </Grid>

          <Grid container item xs={8} sx={{pl: 4}}>
            <Grid item xs={4}>
              <Typography variant="h5" component="h4">
                {nft.name}
              </Typography>

              <UserLink user={nft.owner} />
            </Grid>
          </Grid>

          <Grid item xs={12} sx={{mt: 3}}>
            <Typography component="div" fontStyle="italic" fontSize="0.8em" textAlign="right" overflow="hidden">
              <Typography fontSize="1em" lineHeight="1.3em" maxHeight="6em" sx={{overflowY: 'auto'}}>
                &nbsp;Complete successful
              </Typography>
              {nft.buy.txn ? (
                <Typography whiteSpace="nowrap" fontSize="1em">
                  Complete TXN: <AlgoLink type="transaction" hash={nft.buy.txn} />
                </Typography>
              ) : null}
            </Typography>
          </Grid>

          <Grid container item xs={12}>
            <Grid item xs={6}>
              <Button size="large" variant="outlined" sx={{mr: 3}} onClick={onCancel}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6} sx={{textAlign: 'right'}}>
              <Button size="large" type="submit" variant="contained">
                Continue
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

AuctionEnd.propTypes = {
  nft: PropTypes.shape({
    name: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired,
    buy: PropTypes.shape({
      txn: PropTypes.string,
    }),
    owner: PropTypes.shape({
      id: PropTypes.number,
      userName: PropTypes.string,
      walletAddress: PropTypes.string,
    }),
  }),
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export function GlobalPopup() {
  const {nft, clear} = useNftSold();
  return (
    <>
      <Modal open={Boolean(nft)} onClose={clear}>
        <Box>
          <AuctionEnd nft={nft} onCancel={clear} onSuccess={clear} />
        </Box>
      </Modal>
    </>
  );
}
