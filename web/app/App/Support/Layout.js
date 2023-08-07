import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

export function Layout({Header, Content}) {
  return (
    <Container maxWidth="md" sx={{pb: 4}}>
      <Grid container component="main" sx={{my: 8}}>
        <Grid item xs={12}>
          {Header ? (
            <Container>
              <Typography variant="h3" component="h1" fontWeight={900} textAlign="center" mb={3}>
                {Header}
              </Typography>
            </Container>
          ) : null}
        </Grid>
        {Content ? (
          <Grid item xs={12}>
            {Content}
          </Grid>
        ) : null}
      </Grid>
    </Container>
  );
}

Layout.propTypes = {
  Header: PropTypes.node,
  Content: PropTypes.node,
};

Layout.defaultprops = {
  Header: null,
  Content: null,
};
