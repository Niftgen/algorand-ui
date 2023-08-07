import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {Referral} from './Referral';
import {Subscribers} from './Subscribers';

export function Dashboard() {
  return (
    <Stack spacing={4}>
      <Paper elevation={2} sx={{p: 2}}>
        <Subscribers />
      </Paper>
      <Paper elevation={2} sx={{p: 2}}>
        <Referral />
      </Paper>
    </Stack>
  );
}
