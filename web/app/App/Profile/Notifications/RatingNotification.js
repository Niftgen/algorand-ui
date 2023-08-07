import LinkIcon from '@mui/icons-material/Link';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import {useAuth} from '@niftgen/useAuth';
import {useFetch} from '@niftgen/useFetch';
import {useIpfs} from '@niftgen/useIpfs';
import {useNotifications} from '@niftgen/useNotifications';
import {useHref, useNavigate} from '@nkbt/react-router';
import PropTypes from 'prop-types';
import {useCallback, useMemo} from 'react';
import {deleteNotification} from './deleteNotification';
import {NotificationAction} from './NotificationAction';

export function RatingNotification({notification}) {
  const {gateway} = useIpfs();
  const {walletAddress} = useAuth();
  const {fetch} = useFetch();
  const query = useMemo(() => {
    switch (notification.asset.kind) {
      case 'VIDEO':
      case 'FREE_VIDEO':
        return {page: 'video', video: notification.asset.id};
      case 'AUDIO':
        return {page: 'audio', audio: notification.asset.id};
      case 'NFT_IMAGE':
      case 'NFT_VIDEO':
      case 'NFT_AUDIO':
        return {page: 'nft', nft: notification.asset.id};
    }
  }, [notification.asset.id, notification.asset.kind]);
  const href = useHref(query);
  const navigate = useNavigate();

  const {remove} = useNotifications();
  const onDelete = useCallback(async () => {
    remove(notification.id);
    await deleteNotification({
      fetch,
      walletAddress,
      id: notification.id,
    });
  }, [fetch, notification.id, remove, walletAddress]);

  return (
    <ListItem sx={{alignItems: 'stretch', p: 3, borderBottom: '1px solid #E9E8F1'}}>
      <ListItemIcon sx={{pt: 0.5, minWidth: '32px'}}>
        <StarOutlineIcon sx={{width: '20px'}} />
      </ListItemIcon>
      <ListItemAvatar sx={{minWidth: '48px'}}>
        <Avatar
          variant="rounded"
          alt="nft"
          src={gateway(notification.asset.cover)}
          sx={{width: '32px', height: '32px'}}
        />
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <Box sx={{display: 'flex', alignItems: 'center', pb: 1}}>
            <Typography variant="body2">{notification.asset.name}</Typography>
            <Link href={href} sx={{display: 'flex', ml: 1, color: 'primary.main'}} onClick={() => navigate(query)}>
              <LinkIcon />
            </Link>
          </Box>
        }
        secondary={
          <Rating
            readOnly
            value={notification.rating.rating}
            precision={0.5}
            size="small"
            sx={{color: 'niftgen.brown'}}
          />
        }
        sx={{m: 0, py: 0.5}}
      />
      <NotificationAction notification={notification} onDelete={onDelete} />
    </ListItem>
  );
}

RatingNotification.propTypes = {
  notification: PropTypes.object.isRequired,
};
