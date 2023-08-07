import {useConfig} from '@niftgen/useConfig';
import {useCallback} from 'react';

export const EMPTY_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export const useIpfs = () => {
  const {ipfs} = useConfig();

  const gateway = useCallback(
    file => {
      const id = `${file}`.replace('ipfs://', '');
      if (id.startsWith('Qm') && id.length === 46) {
        return `${ipfs}/${id}`;
      }
      return EMPTY_GIF;
    },
    [ipfs]
  );

  return {
    gateway,
  };
};
