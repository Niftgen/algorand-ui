import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import {BetaHeader} from '@niftgen/BetaHeader';
import {Logo} from '@niftgen/Logo';
import {useAccount} from '@niftgen/useAccount';
import {getSubscriptionAppStateById, useAlgoAccount, useKyc} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import {useNotifications} from '@niftgen/useNotifications';
import {useCleanHref, useNavigate, useValue} from '@nkbt/react-router';
import PropTypes from 'prop-types';
import {useCallback, useState} from 'react';
import {GlobalPopup} from './GlobalPopup';
import {MainLogo} from './MainLogo';
import {Subscribe} from './Subscribe';
import {UserMenu} from './UserMenu';

function MenuItemLink({query, children}) {
  const navigate = useNavigate();
  const href = useCleanHref(query);

  const onClick = useCallback(
    e => {
      e.preventDefault();
      navigate(query);
    },
    [navigate, query]
  );

  return (
    <MenuItem component={Link} onClick={onClick} href={href}>
      {children}
    </MenuItem>
  );
}

MenuItemLink.propTypes = {
  query: PropTypes.shape({}).isRequired,
  children: PropTypes.node.isRequired,
};

export function Header() {
  const {walletAddress, logout} = useAuth();
  const {
    data: {kyc},
  } = useKyc(walletAddress);
  const {account} = useAccount();
  const {notifications} = useNotifications();

  const [menuOpened, setMenuOpened] = useState(false);
  const handleMenuToggle = useCallback(() => setMenuOpened(e => !e), []);
  const handleClose = useCallback(() => setMenuOpened(false), []);

  const page = useValue('page');
  const navigate = useNavigate();
  const onTabChange = useCallback(
    (_e, value) => {
      navigate({page: value});
    },
    [navigate]
  );

  const [subscribeInProgress, setSubscribeInProgress] = useState(false);
  const {PLATFORM_SUBSCRIPTION_APP_ID} = useConfig();
  const userAlgoAccount = useAlgoAccount(walletAddress);
  const platformAppState = getSubscriptionAppStateById(PLATFORM_SUBSCRIPTION_APP_ID, userAlgoAccount.data);

  return (
    <AppBar
      position="static"
      color="inherit"
      sx={
        page === 'home' || !page
          ? {
              position: 'absolute',
              zIndex: 1,
              background: 'none',
            }
          : {}
      }>
      <Container>
        <Toolbar sx={{minHeight: {xs: 'auto'}, p: {xs: 0}, height: '100%'}}>
          <Stack direction="row">
            <MainLogo />
            <BetaHeader />
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            gap={2}
            spacing={2}
            sx={{
              flexGrow: 1,
              display: account.id > 0 ? {xs: 'none', md: 'flex'} : 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <Tabs value={['videos', 'support'].includes(page) ? page : null} onChange={onTabChange}>
              <Tab value={null} sx={{opacity: 0, maxWidth: 0, minWidth: 0, p: 0}} />
              {account.id > 0 ? <Tab value="videos" label="Videos" /> : null}
              <Tab value="support" label="Resources" />
              {walletAddress && account.id <= 0 ? <Tab onClick={logout} label="Logout" /> : null}
            </Tabs>

            {account.id > 0 && kyc ? (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                sx={{whiteSpace: 'nowrap'}}
                onClick={() => navigate({page: 'creator', creator: 'add-video'})}>
                Upload videos
              </Button>
            ) : null}

            {account.id > 0 && !kyc ? (
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{whiteSpace: 'nowrap'}}
                onClick={() => navigate({page: 'creator', creator: 'apply'})}>
                Apply to be a creator
              </Button>
            ) : null}

            {account.id > 0 ? (
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{whiteSpace: 'nowrap'}}
                onClick={() => setSubscribeInProgress(true)}
                startIcon={<Logo width="1em" />}>
                {platformAppState.subscribed ? 'Subscribed' : 'Subscribe'}
              </Button>
            ) : null}

            {account.id > 0 ? (
              <Box sx={{display: 'flex', gap: 3}}>
                <IconButton onClick={() => navigate({page: 'profile', profile: 'notifications'})}>
                  <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <UserMenu />
              </Box>
            ) : null}
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            sx={{
              flexGrow: 1,
              display:
                account.id > 0
                  ? {
                      xs: 'flex',
                      md: 'none',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }
                  : 'none',
            }}>
            {account.id > 0 ? (
              <Box sx={{display: 'flex', gap: 2}}>
                <IconButton onClick={() => navigate({page: 'profile', profile: 'notifications'})}>
                  <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <UserMenu />
              </Box>
            ) : null}
            <IconButton size="large" onClick={handleMenuToggle} color="inherit">
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              SlideProps={{
                sx: {width: '100%', px: 3},
              }}
              open={menuOpened}
              onClose={handleClose}
              onClick={handleClose}>
              <Box sx={{textAlign: 'right', pt: 0.5}}>
                <IconButton size="large" onClick={handleClose} color="inherit">
                  <KeyboardDoubleArrowRightIcon />
                </IconButton>
              </Box>
              <Stack durection="column" alignItems="flex-end" sx={{textAlign: 'right', pt: 0.5}}>
                <MenuItemLink query={{page: 'videos'}}>Videos</MenuItemLink>
                <MenuItemLink query={{page: 'support', support: 'home'}}>Resources</MenuItemLink>
                {account.id > 0 && kyc ? (
                  <MenuItemLink query={{page: 'creator', creator: 'add-video'}}>Upload videos</MenuItemLink>
                ) : null}
                {account.id > 0 && !kyc ? (
                  <MenuItemLink query={{page: 'creator', creator: 'apply'}}>Apply to be a creator</MenuItemLink>
                ) : null}
                {account.id > 0 ? (
                  <MenuItem
                    component={Button}
                    variant="text"
                    color="primary"
                    size="small"
                    sx={{whiteSpace: 'nowrap'}}
                    onClick={() => {
                      setSubscribeInProgress(true);
                    }}
                    startIcon={<Logo width="1em" />}>
                    {platformAppState.subscribed ? 'Subscribed' : 'Subscribe'}
                  </MenuItem>
                ) : null}
              </Stack>
            </Drawer>
          </Stack>
        </Toolbar>
      </Container>

      <GlobalPopup />

      <Modal open={subscribeInProgress} onClose={() => setSubscribeInProgress(false)}>
        <Box>
          <Subscribe onCancel={() => setSubscribeInProgress(false)} onSuccess={() => setSubscribeInProgress(false)} />
        </Box>
      </Modal>
    </AppBar>
  );
}
