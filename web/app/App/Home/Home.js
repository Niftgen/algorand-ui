import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {useAccount} from '@niftgen/useAccount';
import Blog from './Blog';
import {Browse, ExploreAllButton} from './Browse';
import Introduction from './Introduction';

export function Home() {
  const {account} = useAccount();

  return (
    <>
      <Box sx={{marginBottom: 5}}>
        <Introduction />
      </Box>

      <Box sx={{marginBottom: 5}}>
        <Typography
          fontWeight={500}
          fontSize={{xs: 14, sm: 22}}
          lineHeight="1.25em"
          textAlign="center"
          whiteSpace="normal">
          Earn Tokens for helping to build the community
        </Typography>
      </Box>

      {account.id > 0 ? (
        <Box mb={10}>
          <Container>
            <Typography textAlign="left" whiteSpace="normal" marginBottom={3}>
              Top free to watch videos
            </Typography>
            <Browse kind={['FREE_VIDEO']} />
            <Typography textAlign="left" whiteSpace="normal" marginBottom={3}>
              Top exclusive videos
            </Typography>
            <Browse kind={['VIDEO']} />

            <Box textAlign="center">
              <ExploreAllButton />
            </Box>
          </Container>
        </Box>
      ) : null}

      <Box sx={{py: 3, background: 'var(--background-color-secondary)'}}>
        <Blog />
      </Box>
    </>
  );
}
