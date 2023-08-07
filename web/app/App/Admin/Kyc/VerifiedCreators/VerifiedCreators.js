import Typography from '@mui/material/Typography';
import {decodeAppState, useAlgod} from '@niftgen/useAlgod';
import {useConfig} from '@niftgen/useConfig';
import {useQuery} from '@tanstack/react-query';

export function VerifiedCreators() {
  const {ADMIN_ID} = useConfig();
  const algod = useAlgod();
  const verifiedCreators = useQuery({
    queryKey: ['verifiedCreators'],
    queryFn: async () => {
      const adminApp = await algod.getApplicationByID(ADMIN_ID).do();
      const appState = decodeAppState(adminApp.params['global-state']);
      return appState?.VERIFIED_CREATORS ?? 0;
    },
    enabled: Boolean(algod),
  });
  return <Typography>Verified creators count: {verifiedCreators.data ?? '~'}</Typography>;
}
