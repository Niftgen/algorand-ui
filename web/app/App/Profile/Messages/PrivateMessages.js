import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {Message} from '@niftgen/Messages';
import {useAccount} from '@niftgen/useAccount';
import {useAuth} from '@niftgen/useAuth';
import {useFetch} from '@niftgen/useFetch';
import {useIpfs} from '@niftgen/useIpfs';
import {useUserPrivateMessages} from '@niftgen/useUserPrivateMessages';
import {useHref, useNavigate} from '@nkbt/react-router';
import PropTypes from 'prop-types';
import {useCallback, useEffect, useRef, useState} from 'react';
import addPrivateMessageQuery from './addPrivateMessage.graphql';

async function addPrivateMessage({fetch, walletAddress, addresseeId, content}) {
  const body = await fetch(`/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: addPrivateMessageQuery,
      variables: {walletAddress, addresseeId, content},
    }),
  });

  const {data, errors} = await body.json();
  if (data?.addPrivateMessage) {
    return data?.addPrivateMessage;
  }
  throw new Error(errors?.[0]?.message || 'Unknown server error');
}

function MessagesList({messages, onSubmit, isUpdating}) {
  const {account} = useAccount();
  const {gateway} = useIpfs();

  const [lastMessage] = messages.slice(-1);

  const anchor = useRef(null);
  useEffect(() => {
    if (anchor.current) {
      setTimeout(() => anchor.current.scrollIntoView());
    }
  }, [lastMessage?.id]);

  const notMe =
    messages.length < 1 ? null : [lastMessage?.owner, lastMessage?.addressee].find(({id}) => id !== account.id);

  const userHref = useHref({page: 'user', user: notMe?.walletAddress});
  const navigate = useNavigate();
  const onUserClick = useCallback(
    event => {
      event.preventDefault();
      navigate({page: 'user', user: notMe?.walletAddress});
    },
    [navigate, notMe?.walletAddress]
  );

  return (
    <Box sx={{height: '100%', p: 2}}>
      <Stack
        direction="column"
        alignItems="flex-start"
        spacing={2}
        divider={<Divider orientation="horizontal" flexItem />}
        sx={{height: '100%', position: 'relative'}}>
        <Stack direction="row" alignItems="center" sx={{width: '100%'}}>
          <Avatar alt={notMe.userName} src={gateway(notMe.avatarPath)} variant="rounded" />
          <Typography component="h3" variant="body2" fontWeight="bold" sx={{ml: 2}}>
            {notMe.userName}
          </Typography>

          <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{width: '100%'}}>
            <Button href={userHref} variant="outlined" onClick={onUserClick}>
              View profile
            </Button>
            <Button variant="contained" disabled>
              Follow
            </Button>
          </Stack>
        </Stack>
        <List sx={{dislay: 'block', width: '100%', overflowY: 'auto', flex: 1}}>
          {messages.map(comment => (
            <Message key={comment.id} comment={comment} />
          ))}
          <div ref={anchor} />
        </List>
        <Stack
          component="form"
          onSubmit={onSubmit}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{width: '100%'}}>
          <TextField required fullWidth id="message" label="Message" type="message" name="message" autoComplete="off" />
          <Button type="submit" variant="contained" disabled={isUpdating}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

MessagesList.propTypes = {
  messages: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool.isRequired,
};

export function PrivateMessages({userId}) {
  const {fetch} = useFetch();
  const {messages, add} = useUserPrivateMessages();
  const {walletAddress} = useAuth();

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!fetch) {
        return;
      }
      if (!userId) {
        return;
      }
      setIsUpdating(true);
      const data = new FormData(form);
      addPrivateMessage({fetch, walletAddress, addresseeId: userId, content: data.get('message')}).then(
        myMessage => {
          setIsUpdating(false);
          if (myMessage && isMounted.current) {
            form.reset();
            form.querySelector('#message')?.focus();
            add(myMessage);
          }
        },
        error => {
          console.error(error);
          setIsUpdating(false);
        }
      );
    },
    [fetch, userId, walletAddress, add]
  );

  const filteredMessages = messages
    .filter(message => message.owner.id === userId || message.addressee.id === userId)
    .sort((a, b) => a.id - b.id);

  return filteredMessages.length < 1 ? null : (
    <MessagesList onSubmit={handleSubmit} isUpdating={isUpdating} messages={filteredMessages} />
  );
}

PrivateMessages.propTypes = {
  userId: PropTypes.number,
};
