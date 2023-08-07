import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import {useCallback} from 'react';

export const useUpload = () => {
  const {token} = useAuth();
  const {txn} = useConfig();

  const upload = useCallback(
    file => {
      async function upload() {
        const body = new FormData();
        body.append('file', file);
        const response = await fetch(`${txn}/storjIpfs`, {
          method: 'POST',
          body,
          headers: {
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
          },
        });
        const pin = await response.json();
        return `ipfs://${pin.Hash}`;
      }

      return upload(file);
    },
    [token, txn]
  );

  return {
    upload,
  };
};
