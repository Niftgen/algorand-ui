import Typography from '@mui/material/Typography';
import {AlgoLink} from '@niftgen/AlgoLink';
import {StatusButton} from '@niftgen/StatusButton';
import {useAccount} from '@niftgen/useAccount';
import {getSubscriptionAppStateById, useAlgoAccount, useAlgod} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import {usePlatformSubscriptionPrice} from '@niftgen/useSubscriptionPrice';
import algosdk from 'algosdk';
import PropTypes from 'prop-types';
import {useCallback, useState} from 'react';
import {useReferralWallet} from './useReferralWallet';

async function fetchSubscribeTxns({txn, from, subscriptionAppId, referral}) {
  const res = await window.fetch(`${txn}/subscribe`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({from, subscriptionAppId, referral}),
  });
  if (res.status !== 200) {
    throw new Error(`Cannot generate transactions: ${await res.text()}`);
  }
  return await res.json();
}

async function subscribe({algod, signer, txn, from, subscriptionAppId, referral}) {
  if (!subscriptionAppId) {
    throw new Error('Application must be deployed');
  }
  const {
    txns: [unsignedFee, unsignedSubscribe, unsignedUtility],
    id: [_id1, subscribeTxnId, _id3],
    signedTxns: [_1, _2, signedUtility],
  } = await fetchSubscribeTxns({txn, from, subscriptionAppId, referral});
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

export function PlatformSubscribeButton({children}) {
  const {txn, PLATFORM_SUBSCRIPTION_APP_ID} = useConfig();
  const {provider, walletAddress} = useAuth();
  const {account} = useAccount();

  const userAlgoAccount = useAlgoAccount(walletAddress);

  const platformAppState = getSubscriptionAppStateById(PLATFORM_SUBSCRIPTION_APP_ID, userAlgoAccount.data);

  const {data: referral} = useReferralWallet({referralCode: account.metadata.ref.code});

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
                subscriptionAppId: PLATFORM_SUBSCRIPTION_APP_ID,
                referral,
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
                subscriptionAppId: PLATFORM_SUBSCRIPTION_APP_ID,
                referral,
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
                subscriptionAppId: PLATFORM_SUBSCRIPTION_APP_ID,
                referral,
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
    [referral, provider, userAlgoAccount, algod, txn, walletAddress, PLATFORM_SUBSCRIPTION_APP_ID]
  );

  const {hasEnoughBalance} = usePlatformSubscriptionPrice();

  return (
    <>
      <StatusButton
        onClick={onClick}
        fullWidth
        success={platformAppState.subscribed}
        loading={userAlgoAccount.isLoading || isLoading}
        disabled={
          !userAlgoAccount.isFetched || (userAlgoAccount.isFetched && !platformAppState.optin) || !hasEnoughBalance
        }
        blocked={userAlgoAccount.isFetched && (!platformAppState.optin || !hasEnoughBalance)}
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

PlatformSubscribeButton.propTypes = {
  children: PropTypes.node.isRequired,
};
