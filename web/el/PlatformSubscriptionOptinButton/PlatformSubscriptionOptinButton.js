import Typography from '@mui/material/Typography';
import {AlgoLink} from '@niftgen/AlgoLink';
import {StatusButton} from '@niftgen/StatusButton';
import {getSubscriptionAppStateById, useAlgoAccount, useAlgod} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import algosdk from 'algosdk';
import PropTypes from 'prop-types';
import {useCallback, useState} from 'react';

async function getTxnUnsigned({algod, from, appIndex}) {
  return algosdk.makeApplicationOptInTxnFromObject({
    suggestedParams: Object.assign(await algod.getTransactionParams().do(), {fee: 1000, flatFee: true}),
    appIndex,
    from,
  });
}

export function PlatformSubscriptionOptinButton({children}) {
  const {provider, walletAddress} = useAuth();

  const userAlgoAccount = useAlgoAccount(walletAddress);
  const {PLATFORM_SUBSCRIPTION_APP_ID} = useConfig();
  const platformAppState = getSubscriptionAppStateById(PLATFORM_SUBSCRIPTION_APP_ID, userAlgoAccount.data);

  const [txnId, setTxnId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const algod = useAlgod();
  const onClick = useCallback(
    event => {
      event.preventDefault();

      async function run() {
        setIsLoading(true);
        setErrorMessage(null);

        try {
          const txnUnsigned = await getTxnUnsigned({
            algod,
            from: walletAddress,
            appIndex: PLATFORM_SUBSCRIPTION_APP_ID,
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
            case 'Magic': {
              ({blob: txnSigned} = await window.Magic.algorand.signTransaction(
                algosdk.encodeUnsignedTransaction(txnUnsigned)
              ));
              break;
            }
          }

          const pendingTxn = await algod.sendRawTransaction(txnSigned).do();
          const _txnConfirmation = await algosdk.waitForConfirmation(algod, pendingTxn.txId, 10);
          setTxnId(pendingTxn.txId);

          await userAlgoAccount.refetch();
        } catch (error) {
          console.error(error);
          setErrorMessage(error.message);
        }

        setIsLoading(false);
      }

      run();
    },
    [provider, userAlgoAccount, algod, walletAddress, PLATFORM_SUBSCRIPTION_APP_ID]
  );

  return (
    <>
      <StatusButton
        onClick={onClick}
        fullWidth
        success={platformAppState.optin}
        loading={userAlgoAccount.isLoading || isLoading}
        disabled={!userAlgoAccount.isFetched || (userAlgoAccount.isFetched && platformAppState.optin)}
        error={errorMessage}>
        {children}
      </StatusButton>
      {txnId ? (
        <Typography whiteSpace="nowrap" fontSize="0.8em" padding="1">
          TXN: <AlgoLink type="transaction" hash={txnId} />
        </Typography>
      ) : null}
    </>
  );
}

PlatformSubscriptionOptinButton.propTypes = {
  children: PropTypes.node.isRequired,
};
