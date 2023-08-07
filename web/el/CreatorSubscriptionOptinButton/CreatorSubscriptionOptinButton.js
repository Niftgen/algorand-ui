import Typography from '@mui/material/Typography';
import {AlgoLink} from '@niftgen/AlgoLink';
import {StatusButton} from '@niftgen/StatusButton';
import {getSubscriptionAppStateById, getSubscriptionModuleState, useAlgoAccount, useAlgod} from '@niftgen/useAlgod';
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

export function CreatorSubscriptionOptinButton({creatorWallet, children}) {
  const {SUBSCRIPTION_MODULE_ID} = useConfig();
  const {provider, walletAddress} = useAuth();

  const creatorAlgoAccount = useAlgoAccount(creatorWallet);
  const userAlgoAccount = useAlgoAccount(walletAddress);

  const subscriptionModuleState = getSubscriptionModuleState(SUBSCRIPTION_MODULE_ID, creatorAlgoAccount.data);
  const subscriptionAppState = getSubscriptionAppStateById(
    subscriptionModuleState.subscriptionAppId,
    userAlgoAccount.data
  );

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
          if (!subscriptionModuleState.subscriptionAppId) {
            throw new Error('Subscription application must be deployed');
          }

          const txnUnsigned = await getTxnUnsigned({
            algod,
            from: walletAddress,
            appIndex: subscriptionModuleState.subscriptionAppId,
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
    [creatorWallet, subscriptionModuleState.subscriptionAppId, provider, userAlgoAccount, algod, walletAddress]
  );

  return (
    <>
      <StatusButton
        onClick={onClick}
        fullWidth
        success={subscriptionAppState.optin}
        loading={creatorAlgoAccount.isLoading || userAlgoAccount.isLoading || isLoading}
        disabled={
          !creatorAlgoAccount.isFetched ||
          !(creatorAlgoAccount.isFetched && subscriptionModuleState.subscriptionAppId) ||
          !userAlgoAccount.isFetched ||
          (userAlgoAccount.isFetched && subscriptionAppState.optin)
        }
        blocked={creatorAlgoAccount.isFetched && userAlgoAccount.isFetched && !subscriptionModuleState.optin}
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

CreatorSubscriptionOptinButton.propTypes = {
  creatorWallet: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
