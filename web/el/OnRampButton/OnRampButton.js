import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MuiModal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {ALGO} from '@niftgen/currency';
import {StatusButton} from '@niftgen/StatusButton';
import {useAccount} from '@niftgen/useAccount';
import {useAlgoAccount} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import PropTypes from 'prop-types';
import {useCallback, useEffect, useMemo, useState} from 'react';

export function TransakNotice() {
  return (
    <Tooltip
      arrow
      title={
        <Typography fontSize="1.4em">
          If this is your first time using Transak, you may have to call your bank to approve the purchase of Algo.
          Please note that there is a minimum amount you have to spend to purchase Algos. The leftover amount can be
          used to pay other months of subscription in the future.
        </Typography>
      }
      placement="bottom">
      <IconButton color="primary">
        <InfoOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
}

export function OnRampButton({amount, children}) {
  const {account} = useAccount();
  const {walletAddress} = useAuth();
  const userAlgoAccount = useAlgoAccount(walletAddress);
  const {transak, network} = useConfig();
  const [open, setOpen] = useState(false);

  const onClose = useCallback(() => {
    const $widget = document.querySelector('#transakWidget');
    $widget.contentWindow.postMessage({event_id: 'TRANSAK_WIDGET_CLOSE_REQUEST', data: true}, '*');
    setOpen(false);
  }, []);

  const transakUrl = useMemo(() => {
    const url = new URL(network === 'mainnet' ? 'https://global.transak.com' : 'https://global-stg.transak.com');
    const search = new URLSearchParams({
      hostURL: window.location.origin,
      apiKey: transak,
      environment: network === 'mainnet' ? 'PRODUCTION' : 'STAGING',
      walletAddress,
      disableWalletAddressForm: true,
      themeColor: '919DFA',
      hideExchangeScreen: true,
      cryptoCurrencyCode: ALGO,
      partnerCustomerId: account.id,
      email: account.email,
      redirectURL: '',
      widgetHeight: '90vh',
      userData: JSON.stringify({
        email: account.email,
        dob: account.dateOfBirth,
      }),
      exchangeScreenTitle: 'NIFTGEN',
    });
    url.search = `?${search.toString()}`;
    return url.toString();
  }, [account.dateOfBirth, account.email, account.id, network, transak, walletAddress]);

  const refetchUserAlgoAccount = userAlgoAccount.refetch;
  useEffect(() => {
    function onMessage(e) {
      if (e?.data?.event_id && e.data.event_id.startsWith('TRANSAK')) {
        // eslint-disable-next-line no-console
        console.log(`TRANSAK`, e.data);
        if (e.data.event_id === 'TRANSAK_ORDER_SUCCESSFUL') {
          refetchUserAlgoAccount();
        }
        if (e.data.event_id === 'TRANSAK_WIDGET_CLOSE') {
          setOpen(false);
        }
      }
    }

    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, [refetchUserAlgoAccount]);

  return (
    <>
      <Stack direction="row">
        <Box sx={{flex: 1}}>
          <StatusButton onClick={() => setOpen(true)} fullWidth success={!amount}>
            {children}
          </StatusButton>
        </Box>
        <TransakNotice />
      </Stack>
      <MuiModal open={open} onClose={onClose}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
          }}>
          <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2}}>
            <Typography variant="h5" component="h2">
              Add ALGOs to your wallet
              <TransakNotice />
            </Typography>
            <IconButton onClick={onClose}>
              <ClearOutlinedIcon />
            </IconButton>
          </Box>

          <Box sx={{flex: 1, backgroundColor: 'background.paper'}}>
            <iframe
              id="transakWidget"
              allow="camera;fullscreen;accelerometer;gyroscope;magnetometer"
              allowFullScreen
              src={transakUrl}
              style={{width: '100%', height: '100%', border: 'none'}}
            />
          </Box>
        </Box>
      </MuiModal>
    </>
  );
}

OnRampButton.propTypes = {
  amount: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};
