import {AlgorandExtension} from '@magic-ext/algorand';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {fetchAccount, normaliseAccount, saveRef, useAccount} from '@niftgen/useAccount';
import {fetchAuthConfirmation, fetchAuthTxn, useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import algosdk from 'algosdk';
import {Magic as MagicSdk} from 'magic-sdk';
import {useCallback, useMemo, useState} from 'react';

export default function Magic() {
  const config = useConfig();
  const {updateProvider, updateAddress, updateToken} = useAuth();
  const {update: updateAccount} = useAccount();
  const {api, apikey} = config;
  const [isFetching, setIsFetching] = useState(false);

  const magic = useMemo(() => {
    window.Magic =
      window.Magic ??
      new MagicSdk(config.magic, {
        extensions: {
          algorand: new AlgorandExtension({
            rpcUrl: config.ALGOD_SERVER,
          }),
        },
      });
    return window.Magic;
  }, [config.ALGOD_SERVER, config.magic]);

  const login = useCallback(
    async e => {
      e.preventDefault();
      setIsFetching(true);
      const {email} = e.target.elements;
      const _jwt = await magic.auth.loginWithEmailOTP({email: email.value});
      const walletAddress = await magic.algorand.getWallet();
      window.localStorage.setItem('email', email.value);

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
      updateProvider('Magic');
      updateAddress(walletAddress);
      updateToken(verifiedToken);
      updateAccount(account);
    },
    [api, apikey, magic.algorand, magic.auth, updateAccount, updateAddress, updateProvider, updateToken]
  );

  return (
    <Stack id="magicLogin" direction="row" component="form" onSubmit={login} action="#">
      <TextField
        disabled={isFetching}
        required
        fullWidth
        id="email"
        label="Email Address"
        type="email"
        name="email"
        autoComplete="email"
      />
      <button type="submit" style={{width: 1, height: 1, padding: 0, margin: 0, background: 'none', border: 'none'}} />
    </Stack>
  );
}
