import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {supportPages} from '@niftgen/wiki';
import {SupportLink} from './SupportLink';

export function Home() {
  return (
    <Grid container component="main" spacing={3}>
      <Grid item xs={12}>
        <Container maxWidth="sm">
          <Typography variant="h3" component="h1" fontWeight={900} textAlign="center" mb={2}>
            Resources
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            fontSize={24}
            fontWeight={400}
            textAlign="center"
            lineHeight={1.2}
            mb={6}>
            Whether you’re new to NFTs or an experienced veteran, we have help and information for your Niftgen journey
          </Typography>
        </Container>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h4" component="h3" fontWeight={700} fontSize={32} mb={3}>
          Getting started
        </Typography>
        <Grid container spacing={4} columns={{xs: 2, md: 12}}>
          {Object.entries(supportPages).map(([support, displayText]) => (
            <Grid key={support} item xs={1} md={3}>
              <SupportLink displayText={displayText} query={{support}} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
