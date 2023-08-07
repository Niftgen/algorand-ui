import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {Signup} from '../Signup';

export function SignupPage() {
  return (
    <Container
      component="main"
      disableGutters
      maxWidth={false}
      sx={{
        pt: 6,
        pb: 10,
        px: {xs: 2, md: 0},
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 1,
        transition: 'opacity 200ms',
      }}>
      <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
        Create an account
      </Typography>
      <Typography variant="h6" component="h4" textAlign="center" lineHeight="normal" px={{xs: 2, md: 10}} mb={5}>
        To get started, select your wallet from one of our supported providers
      </Typography>

      <Signup />
    </Container>
  );
}
