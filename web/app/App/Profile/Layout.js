import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import {useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import useMediaQuery from '@mui/material/useMediaQuery';
import {UserMenu} from '@niftgen/Header';
import {Logo} from '@niftgen/Logo';
import {useNotifications} from '@niftgen/useNotifications';
import {StateContext, useNavigate, useRemove} from '@nkbt/react-router';
import PropTypes from 'prop-types';
import {useCallback, useContext, useState} from 'react';
import {Footer} from './Footer';

export function Layout({Toc, Header, Content}) {
  const navigate = useNavigate();
  const {notifications} = useNotifications();

  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.up('sm'), {noSsr: true});
  const md = useMediaQuery(theme.breakpoints.up('md'), {noSsr: true});

  const [menuOpened, setMenuOpened] = useState(false);
  const handleMenuToggle = useCallback(() => setMenuOpened(e => !e), []);
  const handleClose = useCallback(() => setMenuOpened(false), []);

  const router = useContext(StateContext);
  const removeParams = useRemove();
  const onClick = useCallback(
    e => {
      e.preventDefault();
      removeParams(router.query);
    },
    [removeParams, router.query]
  );

  return (
    <Grid container direction="column" sx={{minHeight: '100vh'}}>
      <Grid xs={12} container sx={{pt: 3, px: 3}} alignItems="center">
        <Grid xs={2} sm={3} sx={{px: 2}}>
          <Link onClick={onClick} href="/" sx={{display: 'block', height: 50}}>
            <Logo height="100%" />
          </Link>
        </Grid>
        {md ? (
          <Grid md={4}>
            <Typography variant="h4" component="h1" color="text.prominent">
              {Header}
            </Typography>
          </Grid>
        ) : null}
        <Grid xs={10} sm={9} md={5}>
          <Stack direction="row" spacing={1} justifyContent="end">
            {md ? (
              <Button variant="outlined" sx={{mr: 4, whiteSpace: 'nowrap'}} onClick={() => navigate({page: 'videos'})}>
                Videos
              </Button>
            ) : null}

            <IconButton title="Notifications" onClick={() => navigate({page: 'profile', profile: 'notifications'})}>
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <UserMenu />

            {!sm ? (
              <IconButton size="large" onClick={handleMenuToggle} color="inherit">
                <MenuIcon />
              </IconButton>
            ) : null}
            {!sm ? (
              <Drawer
                SlideProps={{
                  sx: {width: '100%'},
                }}
                open={menuOpened}
                onClose={handleClose}
                onClick={handleClose}>
                <Box sx={{textAlign: 'right', px: 3, pt: 3}}>
                  <IconButton size="large" onClick={handleClose} color="inherit">
                    <KeyboardDoubleArrowLeftIcon />
                  </IconButton>
                </Box>
                {Toc}
              </Drawer>
            ) : null}
          </Stack>
        </Grid>
      </Grid>

      <Grid xs={12} container sx={{px: 3, flex: 1}}>
        {sm ? (
          <Grid sm={5} md={3} sx={{pr: 3}}>
            {Toc}
          </Grid>
        ) : null}
        <Grid xs={12} sm={7} md={9} component="main" sx={{py: 3}}>
          {!md ? (
            <Typography variant="h4" component="h1" color="text.prominent" pb={3}>
              {Header}
            </Typography>
          ) : null}
          {Content}
        </Grid>
      </Grid>

      <Grid xs={12} sx={{pt: 6}}>
        <Footer />
      </Grid>
    </Grid>
  );
}

Layout.propTypes = {
  Toc: PropTypes.node.isRequired,
  Header: PropTypes.node,
  Content: PropTypes.node,
};

Layout.defaultprops = {
  Header: null,
  Content: null,
};
