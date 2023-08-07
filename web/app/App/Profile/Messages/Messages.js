import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {useAccount} from '@niftgen/useAccount';
import {useRealtimePrivateMessages} from '@niftgen/useRealtimePrivateMessages';
import {useUserPrivateMessagesFetcher} from '@niftgen/useUserPrivateMessages';
import {useState} from 'react';
import {PrivateMessages} from './PrivateMessages';
import {UserList} from './UserList';

export function Messages() {
  useUserPrivateMessagesFetcher();

  const [userId, setUserId] = useState(null);
  const {account} = useAccount();

  useRealtimePrivateMessages({userId: account.id});

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 2,
        height: '80%',
      }}>
      <Stack direction="row" sx={{height: '100%', width: '100%'}} divider={<Divider orientation="vertical" flexItem />}>
        <Box sx={{width: '50%'}}>
          <UserList selected={userId} onSelect={setUserId} />
        </Box>

        <Box sx={{width: '50%'}}>
          <PrivateMessages userId={userId} />
        </Box>
      </Stack>
    </Paper>
  );
}
