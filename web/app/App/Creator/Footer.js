import Box from '@mui/material/Box';
import {Copyright} from '@niftgen/Copyright';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: 'center',
        py: 2,
        color: 'var(--font-color-footer-profile)',
        backgroundColor: 'var(--background-color-footer-profile)',
      }}>
      <Copyright />
    </Box>
  );
}
