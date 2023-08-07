import Box from '@mui/material/Box';
import Footer from '@niftgen/Footer';
import {Header} from '@niftgen/Header';
import PropTypes from 'prop-types';

export function AppLayout({children}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}>
      <Header />
      {children}
      <Box sx={{mt: 'auto', backgroundColor: 'grey.200'}}>
        <Footer />
      </Box>
    </Box>
  );
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
