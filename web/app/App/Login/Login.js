import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import LoopIcon from '@mui/icons-material/Loop';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {AlgoLink} from '@niftgen/AlgoLink';
import {fetchAccount, normaliseAccount, saveRef, useAccount} from '@niftgen/useAccount';
import {fetchAuthConfirmation, fetchAuthTxn, useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import algosdk from 'algosdk';
import {useCallback, useState} from 'react';
import AlgoSignerImage from './AlgoSigner.png';
import {MagicLoader} from './Magic';
import PeraWalletImage from './PeraWallet.svg';

function AlgoSignerLogo() {
  return <Box component="img" src={AlgoSignerImage} sx={{pr: 2}} />;
}

function PeraWalletLogo() {
  return <Box component="img" src={PeraWalletImage} sx={{pr: 2}} />;
}

export function Login() {
  const {provider, walletAddress, updateProvider, updateAddress, updateToken} = useAuth();
  const {update: updateAccount} = useAccount();
  const {api, apikey, ledger, chainId} = useConfig();

  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const onError = useCallback(error => {
    console.error(error);
    setIsFetching(false);
    setErrorMessage(error.message);
  }, []);

  const authoriseAlgoSigner = useCallback(() => {
    async function authorise() {
      try {
        setIsFetching(true);
        const {txn: txnUnsigned, jwt: unverifiedToken} = await fetchAuthTxn({api, apikey, walletAddress});
        const [{blob: signedTxn}] = await window.AlgoSigner.signTxn([{txn: txnUnsigned}]);
        const {jwt: verifiedToken} = await fetchAuthConfirmation({
          api,
          apikey,
          txn: signedTxn,
          jwt: unverifiedToken,
        });
        const rawAccount = await fetchAccount({api, apikey, walletAddress, token: verifiedToken});
        const account = await saveRef({
          api,
          apikey,
          token: verifiedToken,
          walletAddress,
          account: normaliseAccount(rawAccount),
        });

        setIsFetching(false);
        updateToken(verifiedToken);
        updateAccount(account);
      } catch (error) {
        onError(error);
      }
    }

    authorise();
  }, [api, apikey, onError, updateAccount, updateToken, walletAddress]);

  const authorisePeraWallet = useCallback(() => {
    async function authorise() {
      try {
        setIsFetching(true);

        const {txn: txnUnsigned, jwt: unverifiedToken} = await fetchAuthTxn({api, apikey, walletAddress});
        const [signedBlob] = await window.PeraWallet.signTransaction([
          [
            {
              txn: algosdk.decodeUnsignedTransaction(Buffer.from(txnUnsigned, 'base64')),
              signers: [walletAddress],
            },
          ],
        ]);

        const {jwt: verifiedToken} = await fetchAuthConfirmation({
          api,
          apikey,
          txn: Buffer.from(signedBlob).toString('base64'),
          jwt: unverifiedToken,
        });
        const rawAccount = await fetchAccount({api, apikey, walletAddress, token: verifiedToken});
        const account = await saveRef({
          api,
          apikey,
          token: verifiedToken,
          walletAddress,
          account: normaliseAccount(rawAccount),
        });

        setIsFetching(false);
        updateToken(verifiedToken);
        updateAccount(account);
      } catch (error) {
        onError(error);
      }
    }

    authorise();
  }, [api, apikey, onError, updateAccount, updateToken, walletAddress]);

  const [algoSignerAccounts, setAlgoSignerAccounts] = useState([]);

  const onAlgoSignerConnect = useCallback(() => {
    updateProvider('AlgoSigner');

    async function init() {
      setIsFetching(true);
      try {
        await window.AlgoSigner.connect({ledger});
        const accounts = await window.AlgoSigner.accounts({ledger});
        setIsFetching(false);
        if (accounts.length < 1) {
          throw new Error(`No accounts addresses detected in the ${ledger} AlgoSigner`);
        }
        setAlgoSignerAccounts(accounts);
        const index = parseInt(window.localStorage.getItem('algoSigner')) || 0;
        if (accounts[index]) {
          window.localStorage.setItem('algoSigner', index);
          updateAddress(accounts[index].address);
        } else {
          window.localStorage.setItem('algoSigner', 0);
          updateAddress(accounts[0].address);
        }
      } catch (error) {
        onError(error);
      }
    }

    init();
  }, [ledger, onError, updateAddress, updateProvider]);

  const onAlgoSignerSwitch = useCallback(() => {
    const index = parseInt(window.localStorage.getItem('algoSigner')) || 0;
    const nextIndex = index + 1 > algoSignerAccounts.length - 1 ? 0 : index + 1;
    window.localStorage.setItem('algoSigner', nextIndex);
    updateAddress(algoSignerAccounts[index].address);
  }, [algoSignerAccounts, updateAddress]);

  const clearWalletAddress = useCallback(() => {
    updateProvider(null);
    updateAddress(null);
  }, [updateAddress, updateProvider]);

  const onPeraWalletConnect = useCallback(() => {
    updateProvider('PeraWallet');

    async function connect() {
      setIsFetching(true);

      try {
        const {PeraWalletConnect} = await import(/* webpackChunkName: "pera" */ '@perawallet/connect');
        window.PeraWallet = window.PeraWallet ?? new PeraWalletConnect({chainId});

        const accounts =
          window.PeraWallet.isConnected && window.PeraWallet.connector
            ? window.PeraWallet.connector.accounts
            : await window.PeraWallet.connect();

        const index = parseInt(window.localStorage.getItem('peraWallet')) || 0;
        if (accounts[index]) {
          window.localStorage.setItem('peraWallet', `${index}`);
          updateAddress(accounts[index]);
        } else {
          window.localStorage.setItem('peraWallet', '0');
          updateAddress(accounts[0]);
        }

        if (window.PeraWallet.isConnected && window.PeraWallet.connector) {
          window.PeraWallet.connector.on('disconnect', () => {
            window.localStorage.clear();
          });
        }
      } catch (error) {
        onError(error);
        // nothing
        if (error?.data?.type !== 'CONNECT_MODAL_CLOSED') {
          // log the necessary errors
        } else {
          updateProvider(null);
        }
      }
      setIsFetching(false);
    }

    connect();
  }, [chainId, onError, updateAddress, updateProvider]);

  const onPeraWalletDisconnect = useCallback(() => {
    async function run() {
      await window.PeraWallet.disconnect();
      clearWalletAddress();
    }

    run();
  }, [clearWalletAddress]);

  const onPeraWalletSwitch = useCallback(() => {
    if (!window.PeraWallet.connector) {
      return;
    }
    const index = parseInt(window.localStorage.getItem('peraWallet')) || 0;
    const nextIndex = index + 1 >= window.PeraWallet.connector.accounts.length ? 0 : index + 1;
    window.localStorage.setItem('peraWallet', nextIndex);
    updateAddress(window.PeraWallet.connector.accounts[index]);
  }, [updateAddress]);

  const onPeraWalletUnlockCancel = useCallback(() => {
    updateProvider(null);
  }, [updateProvider]);

  const isAlgoSignerEnabled = (!provider || provider === 'AlgoSigner') && Boolean(window.AlgoSigner);
  const isPeraWalletEnabled = !provider || provider === 'PeraWallet';
  const isMagicEnabled = !provider || provider === 'Magic';

  const authoriseMagic = useCallback(() => {
    async function authorise() {
      try {
        setIsFetching(true);

        const {txn: txnUnsignedRaw, jwt: unverifiedToken} = await fetchAuthTxn({api, apikey, walletAddress});
        const txnUnsigned = algosdk.decodeUnsignedTransaction(Buffer.from(txnUnsignedRaw, 'base64'));
        const encodedTxn = algosdk.encodeUnsignedTransaction(txnUnsigned);
        const {blob: signedBlob} = await window.Magic.algorand.signTransaction(encodedTxn);

        const {jwt: verifiedToken} = await fetchAuthConfirmation({
          api,
          apikey,
          txn: Buffer.from(signedBlob).toString('base64'),
          jwt: unverifiedToken,
        });
        const rawAccount = await fetchAccount({api, apikey, walletAddress, token: verifiedToken});
        const account = await saveRef({
          api,
          apikey,
          token: verifiedToken,
          walletAddress,
          account: normaliseAccount(rawAccount),
        });

        setIsFetching(false);
        updateToken(verifiedToken);
        updateAccount(account);
      } catch (error) {
        onError(error);
      }
    }

    authorise();
  }, [api, apikey, onError, updateAccount, updateToken, walletAddress]);

  const onClickAuthorise = useCallback(
    event => {
      event.preventDefault();
      if (provider === 'AlgoSigner') {
        return authoriseAlgoSigner();
      }
      if (provider === 'PeraWallet') {
        return authorisePeraWallet();
      }
      if (provider === 'Magic') {
        return authoriseMagic();
      }
    },
    [authoriseAlgoSigner, authoriseMagic, authorisePeraWallet, provider]
  );

  const [emailVisible, setEmailVisible] = useState(false);

  return (
    <Paper
      elevation={8}
      sx={{
        padding: {xs: 2, md: 4},
        borderRadius: 2,
      }}>
      <Grid container spacing={2} direction="column">
        <Grid item container xs={12} sm={6} spacing={2}>
          <Grid item xs={12}>
            {!walletAddress && !emailVisible ? (
              <Button
                disabled={!isMagicEnabled}
                onClick={() => setEmailVisible(true)}
                fullWidth
                variant="outlined"
                startIcon={<EmailIcon sx={{mr: 2}} />}
                sx={{
                  fontSize: 16,
                  py: 2,
                  px: 4,
                  justifyContent: 'flex-start',
                }}>
                Email
              </Button>
            ) : null}
            {emailVisible ? <MagicLoader /> : null}
            {provider === 'Magic' && walletAddress ? (
              <Button
                onClick={async () => {
                  await window.Magic.user.logout();
                  updateProvider(null);
                  updateAddress(null);
                  window.localStorage.clear();
                }}
                fullWidth
                variant="outlined"
                startIcon={<EmailIcon />}
                endIcon={<CheckCircleOutlineIcon />}
                sx={{
                  whiteSpace: 'nowrap',
                  fontSize: 16,
                  py: 2,
                  px: 4,
                  justifyContent: 'flex-start',
                }}>
                <Box component="span" sx={{mr: 'auto'}}>
                  Logout
                </Box>
              </Button>
            ) : null}
          </Grid>
        </Grid>

        <Grid item container xs={12} sm={6} spacing={2}>
          <Grid item xs={12}>
            {!(provider === 'PeraWallet' && !walletAddress) && !(provider === 'PeraWallet' && walletAddress) ? (
              <Button
                disabled={!isPeraWalletEnabled}
                onClick={onPeraWalletConnect}
                fullWidth
                variant="outlined"
                startIcon={<PeraWalletLogo />}
                sx={{
                  fontSize: 16,
                  py: 2,
                  px: 4,
                  justifyContent: 'flex-start',
                }}>
                Pera Wallet
              </Button>
            ) : null}
            {provider === 'PeraWallet' && !walletAddress ? (
              <Button
                disabled={!isPeraWalletEnabled}
                onClick={onPeraWalletUnlockCancel}
                fullWidth
                variant="outlined"
                startIcon={<CancelIcon sx={{mr: 2}} />}
                sx={{
                  fontSize: 16,
                  py: 2,
                  px: 4,
                  justifyContent: 'flex-start',
                }}>
                Cancel
              </Button>
            ) : null}
            {provider === 'PeraWallet' && walletAddress ? (
              <Button
                disabled={!isPeraWalletEnabled}
                onClick={onPeraWalletDisconnect}
                fullWidth
                variant="outlined"
                startIcon={<PeraWalletLogo />}
                endIcon={<CheckCircleOutlineIcon />}
                sx={{
                  fontSize: 16,
                  py: 2,
                  px: 4,
                  justifyContent: 'flex-start',
                }}>
                <Box component="span" sx={{mr: 'auto'}}>
                  Disconnect Pera Wallet
                </Box>
              </Button>
            ) : null}
          </Grid>
        </Grid>

        {window.AlgoSigner ? (
          <Grid item container xs={12} sm={6} spacing={2}>
            <Grid item xs={12}>
              {!isAlgoSignerEnabled || !walletAddress ? (
                <Button
                  disabled={!isAlgoSignerEnabled}
                  onClick={onAlgoSignerConnect}
                  fullWidth
                  variant="outlined"
                  startIcon={<AlgoSignerLogo />}
                  sx={{
                    fontSize: 16,
                    py: 2,
                    px: 4,
                    justifyContent: 'flex-start',
                  }}>
                  AlgoSigner
                </Button>
              ) : null}
              {provider === 'AlgoSigner' && walletAddress ? (
                <Button
                  disabled={!isAlgoSignerEnabled}
                  onClick={clearWalletAddress}
                  fullWidth
                  variant="outlined"
                  startIcon={<AlgoSignerLogo />}
                  endIcon={<CheckCircleOutlineIcon />}
                  sx={{
                    whiteSpace: 'nowrap',
                    fontSize: 16,
                    py: 2,
                    px: 4,
                    justifyContent: 'flex-start',
                  }}>
                  <Box component="span" sx={{mr: 'auto'}}>
                    Disconnect AlgoSigner
                  </Box>
                </Button>
              ) : null}
            </Grid>
          </Grid>
        ) : null}

        {provider === 'PeraWallet' &&
        walletAddress &&
        window.PeraWallet.connector &&
        window.PeraWallet.connector.accounts.length > 1 ? (
          <Grid item xs={12}>
            <Typography textAlign="center">
              Connected:{' '}
              <IconButton onClick={onPeraWalletSwitch} title={walletAddress}>
                <LoopIcon />
              </IconButton>{' '}
              <AlgoLink type="account" hash={walletAddress} />
            </Typography>
          </Grid>
        ) : null}

        {provider === 'PeraWallet' &&
        walletAddress &&
        window.PeraWallet.connector &&
        window.PeraWallet.connector.accounts.length === 1 ? (
          <Grid item xs={12}>
            <Typography textAlign="center">
              Connected: <AlgoLink type="account" hash={walletAddress} />
            </Typography>
          </Grid>
        ) : null}

        {provider === 'AlgoSigner' && walletAddress && algoSignerAccounts.length > 1 ? (
          <Grid item xs={12}>
            <Typography textAlign="center">
              Connected:{' '}
              <IconButton onClick={onAlgoSignerSwitch} title={walletAddress}>
                <LoopIcon />
              </IconButton>{' '}
              <AlgoLink type="account" hash={walletAddress} />
            </Typography>
          </Grid>
        ) : null}

        {provider === 'AlgoSigner' && walletAddress && algoSignerAccounts.length === 1 ? (
          <Grid item xs={12}>
            <Typography textAlign="center">
              Connected: <AlgoLink type="account" hash={walletAddress} />
            </Typography>
          </Grid>
        ) : null}

        {provider === 'Magic' && walletAddress ? (
          <Grid item xs={12}>
            <Typography textAlign="center">
              Connected: <AlgoLink type="account" hash={walletAddress} />
            </Typography>
          </Grid>
        ) : null}

        {errorMessage ? (
          <Grid item xs={12}>
            <Alert variant="filled" severity="error">
              {errorMessage}
            </Alert>
          </Grid>
        ) : null}

        {emailVisible ? (
          <Grid item xs={6} textAlign="center" sx={{mt: 2}}>
            <LoadingButton
              disabled={isFetching}
              loading={isFetching}
              onClick={e => {
                e.preventDefault();
                setIsFetching(true);
                document.querySelector('#magicLogin button')?.click?.();
              }}
              variant="contained"
              sx={{
                fontSize: 16,
                py: 1,
                px: 4,
              }}>
              Next
            </LoadingButton>
          </Grid>
        ) : null}
        {!emailVisible ? (
          <Grid item xs={6} textAlign="center" sx={{mt: 2}}>
            <LoadingButton
              disabled={isFetching || !walletAddress}
              loading={isFetching}
              onClick={onClickAuthorise}
              variant="contained"
              sx={{
                fontSize: 16,
                py: 1,
                px: 4,
              }}>
              Next
            </LoadingButton>
          </Grid>
        ) : null}
      </Grid>
    </Paper>
  );
}
