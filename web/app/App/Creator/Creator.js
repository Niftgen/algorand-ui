import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import {useKyc} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';
import {useAdd, useNavigate, useRemove, useValue} from '@nkbt/react-router';
import PropTypes from 'prop-types';
import {useCallback, useEffect} from 'react';
import {Apply} from './Apply';
import {ChannelVideo} from './ChannelVideo';
import {Dashboard} from './Dashboard';
import {JitsiRoom} from './Jitsi';
import {Layout} from './Layout';
import {UploadChannelVideo} from './UploadChannelVideo';

function ComingSoon() {
  return <Typography color="text.disabled">Coming soon</Typography>;
}

function TocItem({label, value, isActive, sx}) {
  const navigate = useNavigate();
  const onClick = useCallback(() => navigate({creator: value}), [navigate, value]);
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
  const p = useValue('creator');
  const {walletAddress} = useAuth();
  const {
    data: {kyc},
  } = useKyc(walletAddress);

  return (
    <List>
      <TocItem value="dashboard" label="Dashboard" isActive={p === 'dashboard'} />
      <TocItem value="apply" label={kyc ? 'Creator application' : 'Apply to be a creator'} isActive={p === 'apply'} />
      <TocItem value="video" label="Channel videos" isActive={p === 'video'} />
      {['video', 'add-video'].includes(p) ? (
        <TocItem value="add-video" label="Upload video" isActive={p === 'add-video'} sx={{pl: 1}} />
      ) : null}
      <TocItem value="analytics" label="Analytics" isActive={p === 'analytics'} />
      <TocItem value="comments" label="Comments" isActive={p === 'comments'} />
      <TocItem value="finances" label="Finances" isActive={p === 'finances'} />
      <TocItem value="meetings" label="Meetings" isActive={p === 'meetings'} />
    </List>
  );
}

export function useDefaultParams() {
  const addParams = useAdd();
  const removeParams = useRemove();

  useEffect(() => {
    addParams({creator: 'dashboard'});
    return () => {
      if (process.env.NODE_ENV !== 'development') {
        removeParams({creator: 'dashboard'});
      }
    };
  }, [addParams, removeParams]);
}

function KycRequired({children}) {
  const {walletAddress} = useAuth();
  const {
    data: {kyc},
  } = useKyc(walletAddress);
  return kyc ? (
    children
  ) : (
    <>
      <Alert variant="outlined" severity="error" sx={{mb: 3}}>
        In order to perform this action, you need to be a whitelisted video creator on the platform.
      </Alert>
      <Apply />
    </>
  );
}

KycRequired.propTypes = {
  children: PropTypes.node,
};

export function Creator() {
  useDefaultParams();
  const p = useValue('creator');
  const {walletAddress} = useAuth();
  const {
    data: {kyc},
  } = useKyc(walletAddress);
  switch (p) {
    case 'dashboard':
      return (
        <Layout
          Header="Dashboard"
          Toc={<Toc />}
          Content={
            <KycRequired>
              <Dashboard />
            </KycRequired>
          }
        />
      );
    case 'apply':
      return (
        <Layout Header={kyc ? 'Creator application' : 'Apply to be a creator'} Toc={<Toc />} Content={<Apply />} />
      );
    case 'video':
      return <Layout Header="Channel videos" Toc={<Toc />} Content={<ChannelVideo />} />;
    case 'add-video':
      return (
        <Layout
          Header="Upload channel video"
          Toc={<Toc />}
          Content={
            <KycRequired>
              <UploadChannelVideo />
            </KycRequired>
          }
        />
      );
    case 'analytics':
      return <Layout Header="Analytics" Toc={<Toc />} Content={<ComingSoon />} />;
    case 'comments':
      return <Layout Header="Comments" Toc={<Toc />} Content={<ComingSoon />} />;
    case 'finances':
      return <Layout Header="Finances" Toc={<Toc />} Content={<ComingSoon />} />;
    case 'meetings':
      return <Layout Header="Meetings" Toc={<Toc />} Content={<JitsiRoom />} />;
    default:
      return <Layout Header="404" Toc={<Toc />} Content="Not found" />;
  }
}
