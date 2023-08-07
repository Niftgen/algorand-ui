import DeleteIcon from '@mui/icons-material/Delete';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {Niftgen} from '@niftgen/Price';
import {renderDate} from '@niftgen/renderDate';
import {useAccount} from '@niftgen/useAccount';
import {useAuth} from '@niftgen/useAuth';
import {useFetch} from '@niftgen/useFetch';
import {useIpfs} from '@niftgen/useIpfs';
import {useNftComments} from '@niftgen/useNftComments';
import {useNft} from '@niftgen/useNfts';
import {UserLink} from '@niftgen/UserLink';
import {useValue} from '@nkbt/react-router';
import {useCallback, useEffect, useRef, useState} from 'react';
import addCommentQuery from './addComment.graphql';
import deleteCommentQuery from './deleteComment.graphql';

async function addComment({fetch, walletAddress, assetId, content}) {
  const body = await fetch(`/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: addCommentQuery,
      variables: {walletAddress, assetId, content},
    }),
  });

  const {data, errors} = await body.json();
  if (data?.addNftComment) {
    return data?.addNftComment;
  }
  throw new Error(errors?.[0]?.message || 'Unknown server error');
}

async function deleteComment({fetch, walletAddress, id}) {
  const body = await fetch(`/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: deleteCommentQuery,
      variables: {walletAddress, id},
    }),
  });

  const {data, errors} = await body.json();
  if (data?.deleteComment) {
    return data?.deleteComment;
  }
  throw new Error(errors?.[0]?.message || 'Unknown server error');
}

export function Comments() {
  const nftId = useValue('video');
  const {data: nft} = useNft({id: nftId});
  const {comments, add, remove} = useNftComments({id: nft.id});
  const {account} = useAccount();
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

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      const form = event.currentTarget;
      if (!fetch) {
        return;
      }
      setIsUpdating(true);
      const data = new FormData(form);
      addComment({
        fetch,
        walletAddress,
        assetId: nft.id,
        content: data.get('comment'),
      }).then(
        myComment => {
          if (myComment) {
            add(myComment);
          }
          if (!isMounted.current) {
            return;
          }
          if (myComment) {
            form.reset();
          }
          setIsUpdating(false);
        },
        error => {
          console.error(error);
          setIsUpdating(false);
        }
      );
    },
    [nftId, fetch, walletAddress, nft.id, add]
  );

  const handleDelete = useCallback(
    event => {
      event.preventDefault();
      if (!fetch) {
        return;
      }
      setIsUpdating(true);
      const data = new FormData(event.currentTarget);

      deleteComment({fetch, walletAddress, id: Number(data.get('id'))}).then(
        result => {
          if (result) {
            remove(result);
          }
          if (!isMounted.current) {
            return;
          }
          setIsUpdating(false);
        },
        error => {
          console.error(error);
          setIsUpdating(false);
        }
      );
    },
    [fetch, remove, walletAddress]
  );

  const {gateway} = useIpfs();

  return (
    <Stack direction="column" spacing={3}>
      <Typography mb={2}>
        <Alert variant="outlined" severity="info" icon={<Niftgen style={{width: '1em', height: '1em'}} />}>
          You earn tokens for rating videos and leaving a comment. Then you go to the claim reward section to claim your
          reward.
        </Alert>
      </Typography>

      <Stack direction="row" component="form" onSubmit={handleSubmit} spacing={2}>
        <Avatar alt={account.userName} src={gateway(account.avatarPath)} sx={{width: 48, height: 48}} />

        <Box sx={{width: '100%'}}>
          <label htmlFor="comment">
            <FormLabel component="legend" sx={{mb: 1}}>
              Comments
            </FormLabel>
            <TextField multiline name="comment" placeholder="Your comment" minRows={1} style={{width: '100%'}} />
          </label>
          <input type="hidden" name="id" value={nft.id} />
          <LoadingButton size="small" type="submit" variant="contained" loading={isUpdating} sx={{mt: 2}}>
            Submit comment
          </LoadingButton>
        </Box>
      </Stack>
      <Typography variant="h4">Comments {comments.length ? `(${comments.length})` : ''}</Typography>
      <Stack direction="column" spacing={2}>
        {comments.map(comment => (
          <Stack key={comment.id} direction="row" spacing={2}>
            <Avatar alt={comment.owner.userName} src={gateway(comment.owner.avatarPath)} sx={{width: 36, height: 36}} />
            <Box position="relative" width="100%">
              <UserLink user={comment.owner} />
              <Typography whiteSpace="pre-wrap">{comment.content}</Typography>
              <Typography fontWeight={700} fontSize={12}>
                Posted {renderDate({timestamp: comment.createdAt})}
              </Typography>

              {comment.owner.id === account.id ? (
                <Box component="form" onSubmit={handleDelete} sx={{position: 'absolute', top: 0, right: 0}}>
                  <input type="hidden" name="id" value={comment.id} />
                  <Tooltip arrow placement="top" title="Remove comment">
                    <IconButton disabled={isUpdating} type="submit">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : null}
            </Box>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
