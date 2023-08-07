import SendIcon from '@mui/icons-material/Send';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {Message} from '@niftgen/Messages';
import {useAuth} from '@niftgen/useAuth';
import {useFetch} from '@niftgen/useFetch';
import {useUserPrivateMessages} from '@niftgen/useUserPrivateMessages';
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

export function PrivateMessages({user}) {
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
      if (!user?.id) {
        return;
      }
      setIsUpdating(true);
      const data = new FormData(form);
      addPrivateMessage({fetch, walletAddress, addresseeId: user?.id, content: data.get('message')}).then(
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
    [fetch, user?.id, walletAddress, add]
  );

  const filteredMessages = messages
    .filter(message => message.owner.id === user?.id || message.addressee.id === user?.id)
    .sort((a, b) => a.id - b.id);

  const [lastMessage] = filteredMessages.slice(-1);
  const anchor = useRef(null);
  useEffect(() => {
    setTimeout(() => anchor.current.scrollIntoView());
  }, [lastMessage?.id]);

  return (
    <Container sx={{width: 500, maxWidth: '90%', height: '100%', p: 2}}>
      <Stack
        direction="column"
        justifyContent="flex-end"
        alignItems="flex-start"
        spacing={2}
        sx={{height: '100%', position: 'relative'}}>
        <List sx={{dislay: 'block', width: '100%', overflowY: 'auto'}}>
          {filteredMessages.map(comment => (
            <Message key={comment.id} comment={comment} />
          ))}
          <div ref={anchor} />
        </List>
        <Stack
          component="form"
          onSubmit={handleSubmit}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{width: '100%'}}>
          <TextField
            required
            fullWidth
            disabled={isUpdating}
            id="message"
            label="Message"
            type="message"
            name="message"
            autoComplete="off"
            sx={{backgroundColor: 'background.default'}}
          />
          <IconButton type="submit" disabled={isUpdating}>
            <SendIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Container>
  );
}

PrivateMessages.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
};
