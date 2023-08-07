import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {renderDate} from '@niftgen/renderDate';
import {useAccount} from '@niftgen/useAccount';
import {useIpfs} from '@niftgen/useIpfs';
import {useUserPrivateMessages} from '@niftgen/useUserPrivateMessages';
import PropTypes from 'prop-types';
import {useCallback, useMemo} from 'react';

function ThreadLink({selected, user, createdAt, thread, onSelect}) {
  const userOnClick = useCallback(
    event => {
      event.preventDefault();
      onSelect(thread);
    },
    [thread, onSelect]
  );

  const {gateway} = useIpfs();

  return (
    <Box
      component={Button}
      onClick={userOnClick}
      fullWidth
      sx={{
        display: 'block',
        px: 2,
        py: 1,
        borderRadius: 0,
        backgroundColor: selected === user.id ? '#514A77' : 'inherit',
        color: selected === user.id ? 'niftgen.white' : 'niftgen.darkGrey',
        '&:hover': {
          backgroundColor: selected === user.id ? '#514A77' : 'inherit',
          color: selected === user.id ? 'niftgen.white' : 'niftgen.darkGrey',
        },
      }}>
      <Stack direction="row">
        <Avatar alt={user.userName} src={gateway(user.avatarPath)} variant="rounded" />
        <Stack direction="row" justifyContent="space-between" sx={{width: '100%', ml: 1}}>
          <Typography component="h3" variant="body2" fontWeight="bold">
            {user.userName}
          </Typography>
          <Typography component="span" variant="body2">
            {renderDate({timestamp: createdAt})}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

ThreadLink.propTypes = {
  thread: PropTypes.string,
  selected: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
    userName: PropTypes.string,
    avatarPath: PropTypes.string,
  }),
  createdAt: PropTypes.string,
};

export function UserList({selected, onSelect}) {
  const {account} = useAccount();
  const {messages} = useUserPrivateMessages();
  const threads = useMemo(
    () =>
      Object.entries(
        messages.reduce((result, message) => {
          const threadKey = [message.owner.id, message.addressee.id].sort().join('|');
          if (threadKey in result) {
            return result;
          }
          return {...result, [threadKey]: message};
        }, {})
      ),
    [messages]
  );

  const onSelectThread = useCallback(
    thread => {
      const notMe = thread
        .split('|')
        .map(Number)
        .find(id => id !== account.id);
      if (notMe) {
        onSelect(notMe);
      }
    },
    [account.id, onSelect]
  );

  return (
    <Stack
      direction="column"
      justifyContent="start"
      alignItems="flex-start"
      spacing={2}
      sx={{height: '100%', overflowY: 'auto'}}>
      <List sx={{dislay: 'block', width: '100%'}}>
        {threads.map(([thread, comment]) => {
          const user = account.id === comment.owner.id ? comment.addressee : comment.owner;
          return (
            <ThreadLink
              key={thread}
              thread={thread}
              user={user}
              createdAt={comment.createdAt}
              selected={selected}
              onSelect={onSelectThread}
            />
          );
        })}
      </List>
    </Stack>
  );
}

UserList.propTypes = {
  selected: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
};
