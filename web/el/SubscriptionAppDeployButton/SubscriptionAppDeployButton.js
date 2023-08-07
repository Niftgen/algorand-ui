import Typography from '@mui/material/Typography';
import {AlgoLink} from '@niftgen/AlgoLink';
import {StatusButton} from '@niftgen/StatusButton';
import {getSubscriptionModuleState, useAlgoAccount, useAlgod, useKyc} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import algosdk from 'algosdk';
import PropTypes from 'prop-types';
import {useCallback, useState} from 'react';

async function getTxnUnsigned({algod, walletAddress, SUBSCRIPTION_MODULE_ID, ADMIN_ID, USDC_ASSET_ID}) {
  const enc = new window.TextEncoder();
  const unsignedTxPay = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    suggestedParams: Object.assign(await algod.getTransactionParams().do(), {fee: 1_000, flatFee: true}),
    from: walletAddress,
    to: algosdk.getApplicationAddress(SUBSCRIPTION_MODULE_ID),
    amount: 660_000,
  });
  const unsignedTxDeployApp = algosdk.makeApplicationNoOpTxnFromObject({
    suggestedParams: Object.assign(await algod.getTransactionParams().do(), {fee: 6_000, flatFee: true}),
    from: walletAddress,
    appIndex: SUBSCRIPTION_MODULE_ID,
    appArgs: [enc.encode('DEPLOY_SUBSCRIPTION_APP')],
    foreignApps: [ADMIN_ID],
    foreignAssets: [USDC_ASSET_ID],
  });
  algosdk.assignGroupID([unsignedTxPay, unsignedTxDeployApp]);
  return [unsignedTxPay, unsignedTxDeployApp];
}

export function SubscriptionAppDeployButton({children}) {
  const {SUBSCRIPTION_MODULE_ID, ADMIN_ID, USDC_ASSET_ID} = useConfig();
  const {provider, walletAddress} = useAuth();
  const {
    data: {kyc},
  } = useKyc(walletAddress);

  const creatorAlgoAccount = useAlgoAccount(walletAddress);
  const subscriptionModuleState = getSubscriptionModuleState(SUBSCRIPTION_MODULE_ID, creatorAlgoAccount.data);

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
          if (!subscriptionModuleState.optin) {
            throw new Error('Subscription module must be optin');
          }

          const [txnUnsignedFee, txnUnsignedDeploy] = await getTxnUnsigned({
            algod,
            walletAddress,
            SUBSCRIPTION_MODULE_ID,
            ADMIN_ID,
            USDC_ASSET_ID,
          });

          let txnSigned;
          switch (provider) {
            case 'PeraWallet': {
              const [txnSignedFee, txnSignedDeploy] = await window.PeraWallet.signTransaction([
                [
                  {txn: txnUnsignedFee, signers: [walletAddress]},
                  {txn: txnUnsignedDeploy, signers: [walletAddress]},
                ],
              ]);
              txnSigned = [txnSignedFee, txnSignedDeploy];
              break;
            }

            case 'AlgoSigner': {
              const txnSignedEncoded = await window.AlgoSigner.signTxn([
                {txn: Buffer.from(algosdk.encodeUnsignedTransaction(txnUnsignedFee)).toString('base64')},
                {txn: Buffer.from(algosdk.encodeUnsignedTransaction(txnUnsignedDeploy)).toString('base64')},
              ]);
              if (!txnSignedEncoded) {
                throw new Error('Cancelled');
              }
              const [{blob: signedTxPayEncoded}, {blob: signedTxDeployAppEncoded}] = txnSignedEncoded;
              const [signedTxPay, signedTxDeployApp] = [
                Buffer.from(signedTxPayEncoded, 'base64'),
                Buffer.from(signedTxDeployAppEncoded, 'base64'),
              ];
              txnSigned = [signedTxPay, signedTxDeployApp];
              break;
            }

            case 'Magic': {
              const [txnSignedEncodedFee, txnSignedEncodedDeploy] = await window.Magic.algorand.signGroupTransactionV2([
                {txn: Buffer.from(algosdk.encodeUnsignedTransaction(txnUnsignedFee)).toString('base64')},
                {txn: Buffer.from(algosdk.encodeUnsignedTransaction(txnUnsignedDeploy)).toString('base64')},
              ]);
              txnSigned = [Buffer.from(txnSignedEncodedFee, 'base64'), Buffer.from(txnSignedEncodedDeploy, 'base64')];
              break;
            }
          }

          const pendingTxn = await algod.sendRawTransaction(txnSigned).do();
          const _txnConfirmation = await algosdk.waitForConfirmation(algod, pendingTxn.txId, 10);
          setTxnId(txnUnsignedDeploy.txID());

          await creatorAlgoAccount.refetch();
        } catch (error) {
          console.error(error);
          setErrorMessage(error.message);
        }

        setIsLoading(false);
      }

      run();
    },
    [
      subscriptionModuleState.optin,
      provider,
      creatorAlgoAccount,
      algod,
      walletAddress,
      SUBSCRIPTION_MODULE_ID,
      ADMIN_ID,
      USDC_ASSET_ID,
    ]
  );

  return (
    <>
      <StatusButton
        onClick={onClick}
        loading={creatorAlgoAccount.isLoading || isLoading}
        success={subscriptionModuleState.subscriptionAppId > 0}
        disabled={
          !kyc ||
          !creatorAlgoAccount.isFetched ||
          (creatorAlgoAccount.isFetched && !subscriptionModuleState.optin) ||
          (creatorAlgoAccount.isFetched &&
            subscriptionModuleState.optin &&
            subscriptionModuleState.subscriptionAppId > 0)
        }
        blocked={!kyc || (!creatorAlgoAccount.isFetched && !subscriptionModuleState.optin)}
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

SubscriptionAppDeployButton.propTypes = {
  children: PropTypes.node.isRequired,
};
