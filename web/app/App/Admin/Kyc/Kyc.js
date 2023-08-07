import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {AlgoLink} from '@niftgen/AlgoLink';
import {StatusButton} from '@niftgen/StatusButton';
import {getOptinApp, useAlgoAccount, useAlgod} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import {useQueryClient} from '@tanstack/react-query';
import algosdk from 'algosdk';
import {useCallback, useState} from 'react';
import {AppliedAccounts} from './AppliedAccounts';
import {VerifiedCreators} from './VerifiedCreators';

async function getTxnUnsigned({algod, from, appIndex, status, creatorAddress}) {
  const enc = new window.TextEncoder();
  return algosdk.makeApplicationNoOpTxnFromObject({
    suggestedParams: Object.assign(await algod.getTransactionParams().do(), {fee: 1_000, flatFee: true}),
    appIndex,
    from,
    appArgs: [enc.encode('SET_VERIFIED_STATUS'), algosdk.encodeUint64(status)],
    accounts: [creatorAddress],
  });
}

export function Kyc() {
  const {ADMIN_ID} = useConfig();
  const [address, setAddress] = useState('');

  const creatorAlgoAccount = useAlgoAccount(address);
  const adminModuleState = getOptinApp({account: creatorAlgoAccount.data, appId: ADMIN_ID});

  const [txnId, setTxnId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const onChange = useCallback(e => {
    setErrorMessage(null);
    setAddress(e.target.value);
  }, []);

  const {provider, walletAddress} = useAuth();
  const algod = useAlgod();
  const queryClient = useQueryClient();
  const onSubmit = useCallback(
    event => {
      event.preventDefault();

      if (!algosdk.isValidAddress(address)) {
        setErrorMessage('Invalid Algorand address');
        return;
      }

      async function run() {
        setIsLoading(true);
        setErrorMessage(null);

        try {
          const txnUnsigned = await getTxnUnsigned({
            algod,
            from: walletAddress,
            appIndex: ADMIN_ID,
            creatorAddress: address,
            status: adminModuleState?.STATUS === 1 ? 0 : 1,
          });

          let txnSigned;
          switch (provider) {
            case 'PeraWallet': {
              [txnSigned] = await window.PeraWallet.signTransaction([[{txn: txnUnsigned, signers: [walletAddress]}]]);
              break;
            }
            case 'AlgoSigner': {
              const [{blob: txnSignedEncoded}] = await window.AlgoSigner.signTxn([
                {txn: Buffer.from(algosdk.encodeUnsignedTransaction(txnUnsigned)).toString('base64')},
              ]);
              txnSigned = Buffer.from(txnSignedEncoded, 'base64');
              break;
            }
          }

          const pendingTxn = await algod.sendRawTransaction(txnSigned).do();
          const _txnConfirmation = await algosdk.waitForConfirmation(algod, pendingTxn.txId, 10);
          setTxnId(pendingTxn.txId);

          await Promise.all([creatorAlgoAccount.refetch(), queryClient.refetchQueries(['verifiedCreators'])]);
        } catch (error) {
          console.error(error);
          setErrorMessage(error.message);
        }

        setIsLoading(false);
      }

      run();
    },
    [ADMIN_ID, address, adminModuleState?.STATUS, algod, creatorAlgoAccount, provider, queryClient, walletAddress]
  );

  const notOptinError = creatorAlgoAccount.isFetched && !adminModuleState ? 'Wallet must optin Admin app first' : null;

  return (
    <Stack spacing={3} data-testid="admin kyc page" component="form" noValidate onSubmit={onSubmit}>
      <VerifiedCreators />
      <AppliedAccounts setAddress={setAddress} />
      <FormControl component="fieldset">
        <TextField
          id="address"
          label="Wallet address"
          value={address}
          onChange={onChange}
          fullWidth
          autoComplete="none"
          InputProps={{}}
          InputLabelProps={{
            shrink: true,
          }}
          data-testid="wallet address"
        />
      </FormControl>
      <Stack direction="row" spacing={2}>
        <StatusButton
          type={adminModuleState?.STATUS === 1 ? 'button' : 'submit'}
          loading={
            (algosdk.isValidAddress(address) && creatorAlgoAccount.isLoading) ||
            (adminModuleState?.STATUS !== 1 && isLoading)
          }
          success={adminModuleState?.STATUS === 1}
          disabled={
            !creatorAlgoAccount.isFetched ||
            (creatorAlgoAccount.isFetched && !adminModuleState) ||
            adminModuleState?.STATUS === 1
          }
          blocked={creatorAlgoAccount.isFetched && !adminModuleState}
          error={errorMessage || notOptinError}
          data-testid="kyc submit button">
          {(() => {
            if (adminModuleState?.STATUS === 1) {
              return 'Wallet approved';
            }
            if (creatorAlgoAccount.isFetched && !adminModuleState) {
              return 'Wallet not optin';
            }
            return 'Approve wallet';
          })()}
        </StatusButton>

        {adminModuleState?.STATUS === 1 ? (
          <StatusButton
            type="submit"
            loading={(algosdk.isValidAddress(address) && creatorAlgoAccount.isLoading) || isLoading}
            error={errorMessage}
            data-testid="kyc reject button">
            Reject approval
          </StatusButton>
        ) : null}
      </Stack>
      {txnId ? (
        <Typography whiteSpace="nowrap" fontSize="0.8em" padding="1">
          TXN: <AlgoLink type="transaction" hash={txnId} />
        </Typography>
      ) : null}
    </Stack>
  );
}
