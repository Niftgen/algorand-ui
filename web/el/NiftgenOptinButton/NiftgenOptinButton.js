import Typography from '@mui/material/Typography';
import {AlgoLink} from '@niftgen/AlgoLink';
import {StatusButton} from '@niftgen/StatusButton';
import {useAlgoAccount, useAlgod} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import algosdk from 'algosdk';
import PropTypes from 'prop-types';
import {useCallback, useMemo, useState} from 'react';

async function getTxnUnsigned({algod, from, assetIndex}) {
  return algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    suggestedParams: Object.assign(await algod.getTransactionParams().do(), {fee: 1000, flatFee: true}),
    to: from,
    from,
    amount: 0,
    assetIndex,
  });
}

export function NiftgenOptinButton({children}) {
  const {provider, walletAddress} = useAuth();
  const {NIFTGEN_ASSET_ID} = useConfig();
  const userAlgoAccount = useAlgoAccount(walletAddress);
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
          const txnUnsigned = await getTxnUnsigned({algod, from: walletAddress, assetIndex: NIFTGEN_ASSET_ID});

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
    [provider, userAlgoAccount, algod, walletAddress, NIFTGEN_ASSET_ID]
  );

  return (
    <>
      <StatusButton
        onClick={onClick}
        fullWidth
        loading={userAlgoAccount.isLoading || isLoading}
        success={userAlgoAccount.isFetched && hasNiftgenOptin}
        disabled={userAlgoAccount.isFetching || hasNiftgenOptin}
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

NiftgenOptinButton.propTypes = {
  children: PropTypes.node.isRequired,
};
