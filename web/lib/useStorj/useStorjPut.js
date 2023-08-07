import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import {useCallback} from 'react';
import {storjUpload} from './storjUpload';

export function useStorjPut({onProgress}) {
  const {txn} = useConfig();
  const {token, walletAddress} = useAuth();
  const upload = useCallback(
    file => {
      return storjUpload({txn, token, walletAddress, file, onProgress});
    },
    [onProgress, token, txn, walletAddress]
  );

  return {
    upload,
  };
}
