import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {renderDate} from '@niftgen/renderDate';
import {useAuth} from '@niftgen/useAuth';
import {useFetch} from '@niftgen/useFetch';
import {useUserPrivateMessages} from '@niftgen/useUserPrivateMessages';
import PropTypes from 'prop-types';
import {useCallback, useEffect, useRef, useState} from 'react';
import {deleteComment} from './deleteComment';

export function MyMessage({comment}) {
  const {remove} = useUserPrivateMessages();

  const [isUpdating, setIsUpdating] = useState(false);
  const {fetch} = useFetch();

  const {walletAddress} = useAuth();

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleDelete = useCallback(
    event => {
      event.preventDefault();
      if (!fetch) {
        return;
      }
      setIsUpdating(true);

      deleteComment({fetch, walletAddress, id: comment.id}).then(
        result => {
          if (result && isMounted.current) {
            setIsUpdating(false);
            remove(result);
          }
        },
        error => {
          console.error(error);
          setIsUpdating(false);
        }
      );
    },
    [comment.id, fetch, remove, walletAddress]
  );

  return (
    <ListItem alignItems="flex-start">
      <ListItemText
        sx={{
          position: 'relative',
          '& button': {
            opacity: 0,
          },
          '&:hover button': {
            opacity: 0.7,
          },
        }}
        primary={
          <Stack direction="row" justifyContent="space-between" sx={{}}>
            <Typography fontSize={12}>You</Typography>
            <Typography fontSize={12}>{renderDate({timestamp: comment.createdAt})}</Typography>
            <Tooltip arrow placement="top" title="Remove message">
              <IconButton
                disabled={isUpdating}
                onClick={handleDelete}
                size="small"
                sx={{position: 'absolute', right: 0, top: '1em', transition: 'opacity 200ms'}}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        }
        secondary={
          <Typography
            p={1}
            sx={{
              backgroundColor: 'var(--background-color-message-mine)',
              borderRadius: 1,
            }}>
            {comment.content}
          </Typography>
        }
      />
    </ListItem>
  );
}

MyMessage.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number,
    owner: PropTypes.shape({
      id: PropTypes.number,
      userName: PropTypes.string,
      avatarPath: PropTypes.string,
    }),
    content: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
};
