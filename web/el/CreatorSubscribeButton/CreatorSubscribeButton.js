import Typography from '@mui/material/Typography';
import {AlgoLink} from '@niftgen/AlgoLink';
import {StatusButton} from '@niftgen/StatusButton';
import {getSubscriptionAppStateById, getSubscriptionModuleState, useAlgoAccount, useAlgod} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import {useCreatorSubscriptionPrice} from '@niftgen/useSubscriptionPrice';
import algosdk from 'algosdk';
import PropTypes from 'prop-types';
import {useCallback, useState} from 'react';

async function fetchSubscribeTxns({txn, from, subscriptionAppId}) {
  const res = await window.fetch(`${txn}/subscribe`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({from, subscriptionAppId}),
  });
  if (res.status !== 200) {
    throw new Error(`Cannot generate transactions: ${await res.text()}`);
  }
  return await res.json();
}

async function subscribe({algod, signer, txn, from, subscriptionAppId}) {
  if (!subscriptionAppId) {
    throw new Error('Application must be deployed');
  }
  const {
    txns: [unsignedFee, unsignedSubscribe, unsignedUtility],
    id: [_id1, subscribeTxnId, _id3],
    signedTxns: [_1, _2, signedUtility],
  } = await fetchSubscribeTxns({txn, from, subscriptionAppId});
  const txnSignedEncoded = await signer([unsignedFee, unsignedSubscribe, unsignedUtility]);
  if (!txnSignedEncoded) {
    throw new Error('Cancelled');
  }
  const [signedFee, signedSubscribe] = txnSignedEncoded;
  const txnSigned = [signedFee, signedSubscribe, signedUtility].map(tx => Buffer.from(tx, 'base64'));
  const pendingTxn = await algod.sendRawTransaction(txnSigned).do();
  const txnConfirmation = await algosdk.waitForConfirmation(algod, pendingTxn.txId, 10);
  return {txnId: subscribeTxnId, txnConfirmation};
}

export function CreatorSubscribeButton({creatorWallet, children}) {
  const {txn, SUBSCRIPTION_MODULE_ID} = useConfig();
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
          switch (provider) {
            case 'PeraWallet': {
              const {txnId} = await subscribe({
                algod,
                signer: async ([unsignedFee, unsignedSubscribe, unsignedUtility]) => {
                  const [signedFee, signedSubscribe] = await window.PeraWallet.signTransaction([
                    [
                      {
                        txn: algosdk.decodeUnsignedTransaction(Buffer.from(unsignedFee, 'base64')),
                        signers: [walletAddress],
                      },
                      {
                        txn: algosdk.decodeUnsignedTransaction(Buffer.from(unsignedSubscribe, 'base64')),
                        signers: [walletAddress],
                      },
                      {
                        txn: algosdk.decodeUnsignedTransaction(Buffer.from(unsignedUtility, 'base64')),
                        signers: [], // Already signed at the backend
                      },
                    ],
                  ]);
                  return [Buffer.from(signedFee).toString('base64'), Buffer.from(signedSubscribe).toString('base64')];
                },
                txn,
                from: walletAddress,
                subscriptionAppId: subscriptionAppState.subscriptionAppId,
              });
              setTxnId(txnId);
              break;
            }

            case 'AlgoSigner': {
              const {txnId} = await subscribe({
                algod,
                signer: async ([unsignedFee, unsignedSubscribe, unsignedUtility]) => {
                  const [{blob: signedFee}, {blob: signedSubscribe}] = await window.AlgoSigner.signTxn([
                    {txn: unsignedFee},
                    {txn: unsignedSubscribe},
                    {txn: unsignedUtility, signers: []}, // Already signed at the backend
                  ]);
                  return [signedFee, signedSubscribe];
                },
                txn,
                from: walletAddress,
                subscriptionAppId: subscriptionAppState.subscriptionAppId,
              });
              setTxnId(txnId);
              break;
            }

            case 'Magic': {
              const {txnId} = await subscribe({
                algod,
                signer: async ([unsignedFee, unsignedSubscribe, _unsignedUtility]) => {
                  const [txnSignedEncodedFee, txnSignedEncodedSubscribe] =
                    await window.Magic.algorand.signGroupTransactionV2([{txn: unsignedFee}, {txn: unsignedSubscribe}]);

                  return [Buffer.from(txnSignedEncodedFee, 'base64'), Buffer.from(txnSignedEncodedSubscribe, 'base64')];
                },
                txn,
                from: walletAddress,
                subscriptionAppId: subscriptionAppState.subscriptionAppId,
              });
              setTxnId(txnId);
              break;
            }
          }
          await userAlgoAccount.refetch();
        } catch (error) {
          console.error(error);
          setErrorMessage(error.message);
        }

        setIsLoading(false);
      }

      run();
    },
    [walletAddress, creatorWallet, provider, userAlgoAccount, algod, txn, subscriptionAppState.subscriptionAppId]
  );

  const {hasEnoughBalance} = useCreatorSubscriptionPrice();

  return (
    <>
      <StatusButton
        onClick={onClick}
        fullWidth
        success={subscriptionAppState.subscribed}
        loading={creatorAlgoAccount.isLoading || userAlgoAccount.isLoading || isLoading}
        disabled={
          !creatorAlgoAccount.isFetched ||
          !(creatorAlgoAccount.isFetched && subscriptionModuleState.subscriptionAppId) ||
          !userAlgoAccount.isFetched ||
          (userAlgoAccount.isFetched && !subscriptionAppState.optin) ||
          !hasEnoughBalance
        }
        blocked={
          creatorAlgoAccount.isFetched &&
          userAlgoAccount.isFetched &&
          (!subscriptionAppState.optin || !hasEnoughBalance)
        }
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

CreatorSubscribeButton.propTypes = {
  creatorWallet: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
