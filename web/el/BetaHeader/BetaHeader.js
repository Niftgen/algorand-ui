import Typography from '@mui/material/Typography';
import {useConfig} from '@niftgen/useConfig';

export function BetaHeader() {
  const {network} = useConfig();
  return network === 'testnet' ? <Typography sx={{py: 2, px: 1, cursor: 'pointer'}}>Beta</Typography> : null;
}
