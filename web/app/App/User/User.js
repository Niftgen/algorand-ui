import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {Niftgen} from '@niftgen/Price';
import {Discord, Facebook, Instagram, Twitter} from '@niftgen/SocialMediaLogo';
import {StatusButton} from '@niftgen/StatusButton';
import {useAccount} from '@niftgen/useAccount';
import {getSubscriptionAppStateById, getSubscriptionModuleState, useAlgoAccount} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import {useIpfs} from '@niftgen/useIpfs';
import {useProfile} from '@niftgen/useProfile';
import {useRealtimePrivateMessages} from '@niftgen/useRealtimePrivateMessages';
import {useUserPrivateMessagesFetcher} from '@niftgen/useUserPrivateMessages';
import {useAdd, useNavigate, useRemove, useValue} from '@nkbt/react-router';
import intlFormat from 'date-fns/intlFormat';
import PropTypes from 'prop-types';
import {useCallback, useEffect, useState} from 'react';
import {Calendar} from './Calendar';
import {MyNfts} from './MyNfts';
import {PrivateMessages} from './PrivateMessages';
import {Subscribe} from './Subscribe';

export const SocialLink = ({host, url, Icon}) => {
  const href = (() => {
    if (!url) {
      return;
    }
    try {
      const parsed = new URL(url);
      // Syntactically correct link could point to a wrong website
      if (parsed.hostname === host) {
        return parsed.href;
      }
    } catch (_err) {
      // whatever
    }
  })();
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      underline="none"
      sx={{
        display: 'block',
        height: '2em',
        width: '2em',
        color: !href ? 'text.disabled' : 'text.primary',
      }}>
      <Icon width="100%" height="100%" />
    </Link>
  );
};
SocialLink.propTypes = {
  host: PropTypes.string.isRequired,
  url: PropTypes.string,
  Icon: PropTypes.func.isRequired,
};

export function useMessengerParam() {
  const addParams = useAdd();
  const removeParams = useRemove();

  useEffect(() => {
    addParams({messenger: 'closed'});
    return () => {
      if (process.env.NODE_ENV !== 'development') {
        removeParams({messenger: null});
      }
    };
  }, [addParams, removeParams]);

  const navigate = useNavigate();

  const messenger = useValue('messenger');
  const onMessengerOpen = useCallback(() => {
    navigate({messenger: 'opened'});
  }, [navigate]);
  const onMessengerClose = useCallback(() => {
    navigate({messenger: 'closed'});
  }, [navigate]);

  return {
    isMessengerOpened: messenger === 'opened',
    onMessengerOpen,
    onMessengerClose,
  };
}

function SubscribeButton({creatorWallet, onClick}) {
  const {PLATFORM_SUBSCRIPTION_APP_ID, SUBSCRIPTION_MODULE_ID} = useConfig();
  const {walletAddress} = useAuth();

  const creatorAlgoAccount = useAlgoAccount(creatorWallet);
  const userAlgoAccount = useAlgoAccount(walletAddress);

  const subscriptionModuleState = getSubscriptionModuleState(SUBSCRIPTION_MODULE_ID, creatorAlgoAccount.data);
  const subscriptionAppState = getSubscriptionAppStateById(
    subscriptionModuleState.subscriptionAppId,
    userAlgoAccount.data
  );

  const platformAppState = getSubscriptionAppStateById(PLATFORM_SUBSCRIPTION_APP_ID, userAlgoAccount.data);

  const expiryTimestamp = Math.max(platformAppState.expiryDate, subscriptionAppState.expiryDate);

  return (
    <Tooltip
      arrow
      placement="top"
      title={
        expiryTimestamp > 0 ? (
          <Typography>
            Active until:{' '}
            {intlFormat(new Date(expiryTimestamp), {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            })}
          </Typography>
        ) : null
      }>
      <span>
        <StatusButton
          size="small"
          variant="contained"
          disabled={walletAddress === creatorWallet || creatorAlgoAccount.isLoading || userAlgoAccount.isLoading}
          onClick={onClick}>
          {platformAppState.subscribed ? (
            <>
              <Niftgen style={{width: '1.1em', height: '1.1em', marginRight: '3px'}} /> Subscribed
            </>
          ) : null}
          {!platformAppState.subscribed && subscriptionAppState.subscribed ? 'Subscribed' : null}
          {!platformAppState.subscribed && !subscriptionAppState.subscribed ? 'Subscribe' : null}
        </StatusButton>
      </span>
    </Tooltip>
  );
}

SubscribeButton.propTypes = {
  creatorWallet: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export function User() {
  const walletAddress = useValue('user');
  const {data: creator} = useProfile({walletAddress});
  const {account} = useAccount();

  useUserPrivateMessagesFetcher();
  useRealtimePrivateMessages({userId: account.id});

  const {walletAddress: myWalletAddress} = useAuth();

  const navigate = useNavigate();
  useEffect(() => {
    if (!walletAddress) {
      navigate({page: 'videos'});
    }
  }, [navigate, walletAddress]);

  const removeParams = useRemove();
  useEffect(
    () => () => {
      if (process.env.NODE_ENV !== 'development') {
        removeParams({user: null});
      }
    },
    [removeParams]
  );
  const {isMessengerOpened, onMessengerOpen, onMessengerClose} = useMessengerParam();

  const [anchor, setAnchor] = useState(null);
  const handleMenuToggle = useCallback(({currentTarget}) => setAnchor(e => (e === null ? currentTarget : null)), []);
  const handleClose = useCallback(() => setAnchor(null), []);

  const [subscribeInProgress, setSubscribeInProgress] = useState(false);

  const {gateway} = useIpfs();
  return (
    <Stack component="main" sx={{flex: 1}}>
      <Container sx={{flex: 1}}>
        <Box sx={{mt: 3, height: 300, background: 'var(--background-color-secondary)'}} />
        <Stack direction="row" spacing={3} sx={{px: 3, height: '4em'}} alignItems="center">
          <Avatar
            alt={creator?.userName}
            src={gateway(creator?.avatarPath)}
            sx={{
              width: 100,
              height: 100,
              transform: 'translateY(-1.8em)',
              border: '6px solid var(--border-color-profile-avatar)',
            }}
          />

          <Typography component="h1" variant="h3" sx={{color: 'var(--font-color-profile-name)'}}>
            {creator?.userName}
          </Typography>

          {/*
          <Button
            size="small"
            variant="contained"
            disabled={true || myWalletAddress === creator.walletAddress}
            sx={{display: {xs: 'none', md: 'block'}}}>
            Follow
          </Button>
          */}

          <Box sx={{display: {xs: 'none', md: 'flex'}}}>
            <Calendar creatorWallet={walletAddress} />
          </Box>

          <Box sx={{display: {xs: 'none', md: 'flex'}}}>
            <SubscribeButton creatorWallet={walletAddress} onClick={() => setSubscribeInProgress(true)} />
          </Box>

          <Button
            size="small"
            variant="contained"
            disabled={myWalletAddress === creator.walletAddress}
            onClick={onMessengerOpen}
            sx={{display: {xs: 'none', md: 'block'}}}>
            Message user
          </Button>
          <IconButton onClick={handleMenuToggle}>
            <MoreHorizIcon />
          </IconButton>
          <Menu
            anchorEl={anchor}
            keepMounted
            open={Boolean(anchor)}
            onClose={handleClose}
            onClick={() => setAnchor(null)}>
            <MenuItem
              disabled={true || myWalletAddress === creator.walletAddress}
              sx={{display: {xs: 'block', md: 'none'}}}>
              Follow
            </MenuItem>

            <MenuItem
              disabled={myWalletAddress === creator.walletAddress}
              onClick={onMessengerOpen}
              sx={{display: {xs: 'block', md: 'none'}}}>
              Message user
            </MenuItem>
            <Divider sx={{display: {xs: 'block', md: 'none'}}} />
            <MenuItem disabled={true || myWalletAddress === creator.walletAddress}>Report {creator.userName}</MenuItem>
            <MenuItem disabled={true || myWalletAddress === creator.walletAddress}>Block {creator.userName}</MenuItem>
          </Menu>
        </Stack>

        <Box sx={{display: {xs: 'block', md: 'none'}, textAlign: 'center', my: 3}}>
          <SubscribeButton creatorWallet={walletAddress} onClick={() => setSubscribeInProgress(true)} />
        </Box>

        {creator.bio ? (
          <Typography pt={3} whiteSpace="pre-wrap" width={{sm: '100%', md: '80%', lg: '70%'}}>
            {creator.bio}
          </Typography>
        ) : null}

        {creator?.types?.length ? (
          <Typography>
            {creator?.types
              ?.map(({description}) => description)
              .filter(Boolean)
              .join(', ')}
          </Typography>
        ) : null}

        <Stack direction="row" pt={3} width={{sm: '100%', md: '80%', lg: '70%'}} justifyContent="center" spacing={3}>
          <SocialLink host="twitter.com" url={creator.twitterUrl} Icon={Twitter} />
          <SocialLink host="instagram.com" url={creator.instagramUrl} Icon={Instagram} />
          <SocialLink host="discord.com" url={creator.discordUrl} Icon={Discord} />
          <SocialLink host="facebook.com" url={creator.facebookUrl} Icon={Facebook} />
        </Stack>

        <Drawer
          anchor="right"
          open={isMessengerOpened}
          onClose={onMessengerClose}
          SlideProps={{
            sx: {borderLeft: '1px solid var(--mui-palette-action-focus)'},
          }}>
          <Box sx={{textAlign: 'left', px: 3, pt: 3}}>
            <IconButton size="large" onClick={onMessengerClose} color="inherit">
              <ClearOutlinedIcon />
            </IconButton>
          </Box>
          <PrivateMessages user={creator} />
        </Drawer>
      </Container>

      <MyNfts />

      <Modal open={subscribeInProgress} onClose={() => setSubscribeInProgress(false)}>
        <Box>
          <Subscribe
            creatorWallet={creator.walletAddress}
            onCancel={() => setSubscribeInProgress(false)}
            onSuccess={() => setSubscribeInProgress(false)}
          />
        </Box>
      </Modal>
    </Stack>
  );
}
