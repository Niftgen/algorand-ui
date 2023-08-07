import Typography from '@mui/material/Typography';
import {AlgoLink} from '@niftgen/AlgoLink';
import {StatusButton} from '@niftgen/StatusButton';
import {getOptinApp, useAlgoAccount, useAlgod} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import algosdk from 'algosdk';
import PropTypes from 'prop-types';
import {useCallback, useMemo, useState} from 'react';

async function getTxnUnsigned({
  algod,
  walletAddress,
  NIFTGEN_ASSET_ID,
  REWARD_MODULE_ID,
  ADMIN_ID,
  FEES_TO_PAY,
  REWARDS_AMOUNT,
}) {
  const enc = new window.TextEncoder();

  const unsignedTransactions = [
    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      suggestedParams: Object.assign(await algod.getTransactionParams().do(), {fee: 1_000, flatFee: true}),
      from: walletAddress,
      to: algosdk.getApplicationAddress(ADMIN_ID),
      amount: FEES_TO_PAY,
    }),
    algosdk.makeApplicationNoOpTxnFromObject({
      suggestedParams: Object.assign(await algod.getTransactionParams().do(), {fee: 4_000, flatFee: true}),
      appIndex: REWARD_MODULE_ID,
      from: walletAddress,
      appArgs: [enc.encode('GET_PENDING_REWARDS'), algosdk.encodeUint64(REWARDS_AMOUNT)],
      foreignAssets: [NIFTGEN_ASSET_ID],
      foreignApps: [ADMIN_ID],
    }),
  ];
  algosdk.assignGroupID(unsignedTransactions);

  return unsignedTransactions;
}

export function ClaimRewardsButton({children}) {
  const {provider, walletAddress} = useAuth();
  const {NIFTGEN_ASSET_ID, REWARD_MODULE_ID, ADMIN_ID} = useConfig();
  const userAlgoAccount = useAlgoAccount(walletAddress);
  const rewardsAppState = getOptinApp({account: userAlgoAccount.data, appId: REWARD_MODULE_ID});

  const hasNiftgenOptin = useMemo(() => {
    if (!userAlgoAccount.data) {
      return;
    }
    return userAlgoAccount.data.assets.some(asset => asset['asset-id'] === NIFTGEN_ASSET_ID);
  }, [NIFTGEN_ASSET_ID, userAlgoAccount.data]);

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
          const [txnUnsignedFee, txnUnsignedClaim] = await getTxnUnsigned({
            algod,
            walletAddress,
            NIFTGEN_ASSET_ID,
            REWARD_MODULE_ID,
            ADMIN_ID,
            FEES_TO_PAY: rewardsAppState.FEES_TO_PAY,
            REWARDS_AMOUNT: rewardsAppState.REWARDS_AMOUNT,
          });

          let txnSigned;
          switch (provider) {
            case 'PeraWallet': {
              txnSigned = await window.PeraWallet.signTransaction([
                [
                  {txn: txnUnsignedFee, signers: [walletAddress]},
                  {txn: txnUnsignedClaim, signers: [walletAddress]},
                ],
              ]);
              break;
            }

            case 'AlgoSigner': {
              const [{blob: txnSignedEncodedFee}, {blob: txnSignedEncodedClaim}] = await window.AlgoSigner.signTxn([
                {txn: Buffer.from(algosdk.encodeUnsignedTransaction(txnUnsignedFee)).toString('base64')},
                {txn: Buffer.from(algosdk.encodeUnsignedTransaction(txnUnsignedClaim)).toString('base64')},
              ]);
              txnSigned = [Buffer.from(txnSignedEncodedFee, 'base64'), Buffer.from(txnSignedEncodedClaim, 'base64')];
              break;
            }

            case 'Magic': {
              const [txnSignedEncodedFee, txnSignedEncodedClaim] = await window.Magic.algorand.signGroupTransactionV2([
                {txn: Buffer.from(algosdk.encodeUnsignedTransaction(txnUnsignedFee)).toString('base64')},
                {txn: Buffer.from(algosdk.encodeUnsignedTransaction(txnUnsignedClaim)).toString('base64')},
              ]);
              txnSigned = [Buffer.from(txnSignedEncodedFee, 'base64'), Buffer.from(txnSignedEncodedClaim, 'base64')];
              break;
            }
          }

          const pendingTxn = await algod.sendRawTransaction(txnSigned).do();
          const _txnConfirmation = await algosdk.waitForConfirmation(algod, pendingTxn.txId, 10);
          setTxnId(txnUnsignedClaim.txID());
          await userAlgoAccount.refetch();
        } catch (error) {
          console.error(error);
          setErrorMessage(error.message);
        }

        setIsLoading(false);
      }

      run();
    },
    [
      walletAddress,
      provider,
      userAlgoAccount,
      algod,
      NIFTGEN_ASSET_ID,
      REWARD_MODULE_ID,
      ADMIN_ID,
      rewardsAppState?.FEES_TO_PAY,
      rewardsAppState?.REWARDS_AMOUNT,
    ]
  );

  return (
    <>
      <StatusButton
        onClick={onClick}
        fullWidth
        loading={userAlgoAccount.isLoading || isLoading}
        success={userAlgoAccount.isFetched && rewardsAppState && rewardsAppState.REWARDS_AMOUNT === 0}
        disabled={!userAlgoAccount.isFetched || !rewardsAppState || rewardsAppState.REWARDS_AMOUNT === 0}
        blocked={userAlgoAccount.isFetched && (!rewardsAppState || !hasNiftgenOptin)}
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

ClaimRewardsButton.propTypes = {
  children: PropTypes.node.isRequired,
};
