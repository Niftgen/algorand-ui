import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Hero} from '@niftgen/Hero';
import {Modal} from '@niftgen/Modal';
import {useAccount} from '@niftgen/useAccount';
import {useAuth} from '@niftgen/useAuth';
import {useEffect, useState} from 'react';
import {Login} from '../../Login';
import {Signup} from '../../Signup';

export function Introduction() {
  const [connectOpened, setConnectOpened] = useState(false);
  const [moreOpened, setMoreOpened] = useState(false);
  const {token} = useAuth();
  const {account} = useAccount();

  useEffect(() => {
    if (connectOpened && token && account.id > 0) {
      setConnectOpened(false);
    }
  }, [account.id, connectOpened, token]);

  return (
    <Box height="500px">
      <Box width="100%" height="500px" overflow="hidden">
        <Hero />
      </Box>
      <Container sx={{transform: 'translateY(-350px)', whiteSpace: 'nowrap'}}>
        <Typography
          fontWeight={900}
          fontSize={{xs: 22, sm: 32, md: 48}}
          lineHeight="1.25em"
          textAlign="center"
          whiteSpace="normal">
          Watch <span className="gradient-text">exclusive </span> content from
          <br />
          your favorite video creators
        </Typography>
        <Typography
          marginTop={3}
          fontWeight={500}
          fontSize={{xs: 14, sm: 22}}
          lineHeight="1.25em"
          textAlign="center"
          whiteSpace="normal">
          Where an engaged community is rewarded
          <br />
          for commenting, rating and
          <Button
            variant="text"
            sx={{textDecoration: 'underline', font: 'inherit', padding: 0, verticalAlign: 'baseline'}}
            onClick={() => setMoreOpened(true)}>
            more
          </Button>
        </Typography>

        {!token && account.id <= 0 ? (
          <Box textAlign="center" mt={3}>
            <Button
              size="large"
              variant="outlined"
              onClick={() => setConnectOpened(true)}
              sx={{
                display: 'inline-block',
                mx: 'auto',
                fontSize: {sm: '1.0em', md: '1.2em'},
                color: 'text.prominent',
              }}>
              Create Account or Login
            </Button>
          </Box>
        ) : null}
        {token && account.id <= 0 ? (
          <Box textAlign="center" mt={3}>
            <Button
              size="large"
              variant="outlined"
              onClick={() => setConnectOpened(true)}
              sx={{
                display: 'inline-block',
                mx: 'auto',
              }}>
              Create an account
            </Button>
          </Box>
        ) : null}
      </Container>

      <Modal
        open={connectOpened}
        onClose={() => setConnectOpened(false)}
        Title={
          <>
            {!token ? 'Create Account or Login' : null}
            {token && account.id <= 0 ? 'Create account' : null}
          </>
        }>
        <>
          {!token ? <Login /> : null}
          {token && account.id <= 0 ? <Signup /> : null}
        </>
      </Modal>

      <Modal open={moreOpened} onClose={() => setMoreOpened(false)} Title="Niftgen Token">
        <Stack direction="column" spacing={2}>
          <Typography>
            Niftgen tokens are rewarded to viewers for engaging with creators on Niftgen. Currently, there are two ways
            tokens can be earned:
            <br />
            - Commenting on videos
            <br />
            - Rating videos
            <br />
          </Typography>

          <Typography>
            More methods will be added in the future for users to earn tokens. These methods are subject to change at
            any moment. Some examples include:
            <br />
            - Watching videos (gamified rewards whereby users will be given quizzes towards the end, and if they answer
            questions correctly, they are rewarded with even more tokens)
            <br />
            - Logging into the platform
            <br />
          </Typography>

          <Typography>
            Niftgen tokens do not have a monetary value, and cannot be bought, sold, traded, or transferred. From April
            or May 2023, the token will be used to access special features on the Niftgen platform, with more options to
            use the tokens in the future.
          </Typography>

          <Typography>
            On earning the tokens, users are required to claim them via the claim tokens section in their user account.
            If they are not claimed, they can not be used.
          </Typography>

          <Typography>
            The purpose of the token is to create strong network effects that will constantly grow the ecosystem. Since
            fans only earn the token by engaging with content and can spend it only within the Niftgen ecosystem, the
            token keeps circulating within the ecosystem and keeps growing.
          </Typography>
        </Stack>
      </Modal>
    </Box>
  );
}
