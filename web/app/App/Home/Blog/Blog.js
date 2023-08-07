import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import {useNavigate} from '@nkbt/react-router';
import {useCallback} from 'react';
import {SupportLink} from '../../Support/SupportLink';
import image from './undraw_book.png';

const blogs = {
  'What-is-Niftgen': 'What is Niftgen',
  'What-is-a-crypto-wallet': 'What is a crypto wallet?',
  'What-is-Blockchain': 'What is Blockchain',
  'Wallet-set-up-Pera-Wallet': 'Wallet set up: Pera Wallet',
};

export function Blog() {
  const navigate = useNavigate();
  const handleHelpClick = useCallback(() => {
    navigate({page: 'support'});
  }, [navigate]);

  return (
    <Container>
      <Grid container sx={{position: 'relative'}}>
        <Grid xs={12} sx={{display: {xs: 'block', md: 'none'}}}>
          <Box sx={{p: '54px 15px 36px'}}>
            <img src={image} alt="Undraw book" width="100%" />
          </Box>
        </Grid>
        <Grid xs={12} md={6}>
          <Typography variant="h2" color="text.primary">
            How Niftgen and Web3 works
          </Typography>
          <Typography variant="h4" color="text.secondary" sx={{mt: '11px'}}>
            Our guide to blockchain applications, the power of web3, and how Niftgen supports creators while encouraging
            interactions with their community.
          </Typography>
        </Grid>
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            bottom: '-36px',
            display: {xs: 'none', md: 'block'},
          }}>
          <img src={image} alt="Undraw book" />
        </Box>
      </Grid>
      <Grid container spacing={4} columns={{xs: 2, md: 12}} sx={{mt: '36px'}}>
        {Object.entries(blogs).map(([support, displayText]) => (
          <Grid key={support} xs={1} md={3}>
            <SupportLink displayText={displayText} query={{support}} />
          </Grid>
        ))}
      </Grid>
      <Button
        variant="outlined"
        onClick={handleHelpClick}
        sx={{
          mt: '58px',
          display: {xs: 'block', md: 'inherit'},
          mx: {xs: 'auto', md: 'inherit'},
          color: 'purple.700',
          borderColor: 'purple.300',
        }}>
        Need more help?
      </Button>
    </Container>
  );
}
