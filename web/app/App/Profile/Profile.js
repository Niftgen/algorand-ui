import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {useAccount} from '@niftgen/useAccount';
import {useNotifications} from '@niftgen/useNotifications';
import {useAdd, useNavigate, useRemove, useValue} from '@nkbt/react-router';
import PropTypes from 'prop-types';
import {useCallback, useEffect} from 'react';
import {AccountDetails} from './AccountDetails';
import {ClaimRewards} from './ClaimRewards';
import {EditProfile} from './EditProfile';
import {Layout} from './Layout';
import {Messages} from './Messages';
import {MySubscriptions} from './MySubscriptions';
import {Notifications} from './Notifications';

function TocItem({label, value, isActive, sx}) {
  const navigate = useNavigate();
  const onClick = useCallback(() => navigate({profile: value}), [navigate, value]);
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick} selected={isActive}>
        <ListItemText primary={label} sx={sx} />
      </ListItemButton>
    </ListItem>
  );
}

TocItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  sx: PropTypes.object,
};

function Toc() {
  const p = useValue('profile');

  const {notifications} = useNotifications();
  const {account} = useAccount();
  const unreadNftMessageCount =
    account?.messageReceivedTotals?.nftMessageTotal - account?.messageReceivedTotals?.nftMessageRead;

  return (
    <List>
      <TocItem value="claim-rewards" label="Claim rewards" isActive={p === 'claim-rewards'} />
      <TocItem value="my-subscriptions" label="My subscriptions" isActive={p === 'my-subscriptions'} />
      <TocItem
        value="notifications"
        label={`Notifications (${notifications.length})`}
        isActive={p === 'notifications'}
      />
      <TocItem
        value="messages"
        label={`Messages ${unreadNftMessageCount ? `(${unreadNftMessageCount})` : ''}`}
        isActive={p === 'messages'}
      />
      <TocItem value="edit-profile" label="Edit profile" isActive={p === 'edit-profile'} />
      <TocItem value="account-details" label="Account details" isActive={p === 'account-details'} />
    </List>
  );
}

export function useDefaultParams() {
  const addParams = useAdd();
  const removeParams = useRemove();

  useEffect(() => {
    addParams({profile: 'edit-profile'});
    return () => {
      if (process.env.NODE_ENV !== 'development') {
        removeParams({profile: 'edit-profile'});
      }
    };
  }, [addParams, removeParams]);
}

export function Profile() {
  useDefaultParams();
  const p = useValue('profile');
  switch (p) {
    case 'notifications':
      return <Layout Header="Notifications" Toc={<Toc />} Content={<Notifications />} />;
    case 'messages':
      return <Layout Header="Messages" Toc={<Toc />} Content={<Messages />} />;
    case 'edit-profile':
      return <Layout Header="Edit profile" Toc={<Toc />} Content={<EditProfile />} />;
    case 'account-details':
      return <Layout Header="Account details" Toc={<Toc />} Content={<AccountDetails />} />;
    case 'claim-rewards':
      return <Layout Header="Claim rewards" Toc={<Toc />} Content={<ClaimRewards />} />;
    case 'my-subscriptions':
      return <Layout Header="My subscriptions" Toc={<Toc />} Content={<MySubscriptions />} />;
    default:
      return <Layout Header="404" Toc={<Toc />} Content="Not found" />;
  }
}
