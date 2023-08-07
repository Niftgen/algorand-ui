import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import {BetaHeader} from '@niftgen/BetaHeader';
import Footer from '@niftgen/Footer';
import LogoutButton from '@niftgen/LogoutButton';
import PropTypes from 'prop-types';

import {MainLogo} from './MainLogo';

export function StandaloneFormLayout({children}) {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
      <AppBar position="static" color="inherit">
        <Container>
          <Toolbar>
            <Stack direction="row" flexGrow={1}>
              <MainLogo />
              <BetaHeader />
            </Stack>
            <LogoutButton startIcon={null} />
          </Toolbar>
        </Container>
      </AppBar>

      {children}

      <Box sx={{justifySelf: 'flex-end'}}>
        <Footer />
      </Box>
    </Box>
  );
}

StandaloneFormLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
