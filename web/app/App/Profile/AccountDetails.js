import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import {useAccount} from '@niftgen/useAccount';
import {useAuth} from '@niftgen/useAuth';
import {useNavigate} from '@nkbt/react-router';
import {useCallback} from 'react';

export function AccountDetails() {
  const navigate = useNavigate();
  const {account, update, remove} = useAccount();
  const {walletAddress, logout} = useAuth();

  const onEmailChange = useCallback(({target: {value: email}}) => update({email}), [update]);

  const onSubmit = useCallback(e => {
    e.preventDefault();
  }, []);

  const onClickUnapprove = useCallback(
    e => {
      e.preventDefault();
      logout();
      navigate({page: 'browse'});
    },
    [logout, navigate]
  );

  const onClickRemove = useCallback(
    e => {
      e.preventDefault();
      remove();
      logout();
      navigate({page: 'videos'});
    },
    [remove, logout, navigate]
  );

  return (
    <Box component="form" noValidate onSubmit={onSubmit} sx={{pt: 2.5}}>
      <Grid container spacing={3}>
        <Grid item xs={12} onClick={() => navigator.clipboard.writeText(walletAddress)} sx={{cursor: 'pointer'}}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <TextField
              disabled
              fullWidth
              name="walletAddress"
              label="Wallet Address"
              type="text"
              id="walletAddress"
              value={walletAddress}
            />
            <ContentCopyOutlinedIcon sx={{ml: 1}} />
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={account.email}
            onChange={onEmailChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained">
            Save changes
          </Button>
        </Grid>
        <Grid item xs={10}>
          <Divider sx={{mt: 2, mb: 3}} />
          <Typography variant="h6" component="h5" fontWeight="bold">
            Logout
          </Typography>
          <Typography variant="body1" lineHeight={1.8} sx={{mt: 1, mb: 3, width: {md: '60%'}}}>
            Disconnecting your wallet means logging out. You will need to log back in with the same wallet to recover
            NFTs associated with that wallet.
          </Typography>
          <Button onClick={onClickUnapprove} variant="outlined" startIcon={<AccountBalanceWalletIcon />}>
            Logout
          </Button>
        </Grid>

        <Grid item xs={10}>
          <Divider sx={{mt: 2, mb: 3}} />
          <Typography variant="h6" component="h5" fontWeight="bold">
            Delete Account
          </Typography>
          <Typography variant="body1" lineHeight={1.8} sx={{mt: 1, mb: 3, width: {md: '60%'}}}>
            By deleting your account, your NFTs will be removed from the Niftgen platform and you will no longer have
            access to them via Niftgen. Deleting your account will remove all of your data and also disconnect the
            wallet.
          </Typography>
          <Button onClick={onClickRemove} variant="contained" color="error" startIcon={<AccountBalanceWalletIcon />}>
            Delete Account
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
