import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {useAuth} from '@niftgen/useAuth';
import {useFetch} from '@niftgen/useFetch';
import {useIpfs} from '@niftgen/useIpfs';
import {useNft, useRemoveNft} from '@niftgen/useNfts';
import {UserLink} from '@niftgen/UserLink';
import PropTypes from 'prop-types';
import {useCallback, useState} from 'react';
import {deleteAsset} from './deleteAsset';

export function Delete({id, onCancel, onSuccess}) {
  const {data: nft} = useNft({id});
  const removeNft = useRemoveNft({id});
  const {fetch} = useFetch();
  const {walletAddress} = useAuth();

  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const onError = useCallback(error => {
    setIsUpdating(false);
    console.error(error);
    setMessage(
      <Alert variant="outlined" severity="error">
        Could not delete: {error.message}
      </Alert>
    );
  }, []);

  const onSubmit = useCallback(
    event => {
      event.preventDefault();

      async function run() {
        setIsUpdating(true);
        setMessage('Deleting');
        await deleteAsset({fetch, ownerAddress: walletAddress, id: nft.id});
        setMessage('Delete successful');
        setIsUpdating(false);
        removeNft();
        onSuccess();
      }

      run().catch(onError);
    },
    [fetch, nft.id, onError, onSuccess, removeNft, walletAddress]
  );

  const {gateway} = useIpfs();
  return (
    <Paper
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: {lg: '50%', md: '70%', sm: '90%', xs: '90%'},
      }}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2}}>
        <Typography variant="h5" component="h2">
          Confirm delete
        </Typography>
        <IconButton onClick={onCancel}>
          <ClearOutlinedIcon />
        </IconButton>
      </Box>
      <Divider />

      <Box component="form" onSubmit={onSubmit} sx={{p: 3, maxHeight: '90vh', overflowY: 'auto'}}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Card sx={{height: 200}}>
              <CardMedia component="img" height="200" image={gateway(nft.cover)} />
            </Card>
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
            <Typography component="div" fontStyle="italic" fontSize="0.8em" textAlign="right">
              &nbsp;{message}
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{textAlign: 'right'}}>
            <LoadingButton size="large" type="submit" variant="contained" loading={isUpdating}>
              Delete
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

Delete.propTypes = {
  id: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
