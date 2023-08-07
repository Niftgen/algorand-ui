import LinkIcon from '@mui/icons-material/Link';
import MessageIcon from '@mui/icons-material/Message';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
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

export function ExpiredSubscriptionNotification({notification}) {
  const {gateway} = useIpfs();
  const {walletAddress} = useAuth();
  const {fetch} = useFetch();
  const query = useMemo(
    () => ({page: 'user', user: notification.originator.walletAddress}),
    [notification.originator.walletAddress]
  );
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
        <MessageIcon sx={{width: '20px'}} />
      </ListItemIcon>
      <ListItemAvatar sx={{minWidth: '48px'}}>
        <Avatar
          variant="rounded"
          alt="nft"
          src={gateway(notification.originator.avatarPath)}
          sx={{width: '32px', height: '32px'}}
        />
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <Box sx={{display: 'flex', alignItems: 'center', pb: 1}}>
            <Typography variant="body2">{notification.originator.userName}</Typography>
            <Link href={href} sx={{display: 'flex', ml: 1, color: 'primary.main'}} onClick={() => navigate(query)}>
              <LinkIcon />
            </Link>
          </Box>
        }
        secondary={<Typography sx={{fontWeight: 500, lineHeight: '20px'}}>{notification.notification}</Typography>}
        sx={{m: 0, py: 0.5}}
      />
      <NotificationAction notification={notification} onDelete={onDelete} />
    </ListItem>
  );
}

ExpiredSubscriptionNotification.propTypes = {
  notification: PropTypes.object.isRequired,
};
