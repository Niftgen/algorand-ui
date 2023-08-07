import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import {AlgoPrice} from '@niftgen/AlgoPrice';
import {Copyright} from '@niftgen/Copyright';
import {Logo, LogoText} from '@niftgen/Logo';
import {Discord, Facebook, Instagram, Reddit, Twitter} from '@niftgen/SocialMediaLogo';
import {StateContext, useCleanHref, useNavigate, useRemove} from '@nkbt/react-router';
import PropTypes from 'prop-types';
import {useCallback, useContext, useMemo} from 'react';

export function SupportLink({topic, children}) {
  const navigate = useNavigate();
  const supportQuery = useMemo(() => ({page: 'support', support: topic}), [topic]);
  const supportHref = useCleanHref(supportQuery);
  const supportOnClick = useCallback(
    event => {
      event.preventDefault();
      navigate(supportQuery);
    },
    [navigate, supportQuery]
  );

  return (
    <Link
      href={supportHref}
      sx={{
        color: 'var(--font-color-footer)',
        textDecoration: 'underline',
        whiteSpace: 'nowrap',
      }}
      onClick={supportOnClick}>
      {children}
    </Link>
  );
}

SupportLink.propTypes = {
  topic: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

function FooterLink(props) {
  if (!props.href) {
    return (
      <Link
        sx={{
          color: 'var(--background-color-input-disabled)',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          cursor: 'not-allowed',
        }}
        {...props}>
        <Tooltip arrow placement="top" title="Coming soon">
          <span>{props.children}</span>
        </Tooltip>
      </Link>
    );
  }
  return (
    <Link
      sx={{
        color: 'var(--font-color-footer)',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
      }}
      {...props}
    />
  );
}

FooterLink.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export function Footer() {
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
    <Box
      component="footer"
      pt={3}
      pb={2}
      sx={{
        borderTop: '1px solid var(--border-color-footer)',
        backgroundColor: 'var(--background-color-footer)',
        color: 'var(--font-color-footer)',
        cursor: 'default',
      }}>
      <Container>
        <Grid component="section" container columnSpacing={6}>
          <Grid xs={12} sm={6} md={3} pt={2}>
            <Link onClick={onClick} href="/" sx={{display: 'block', height: 100}}>
              <Logo height="100%" color="var(--font-color-footer)" />
              <LogoText height="100%" color="var(--font-color-footer)" />
            </Link>

            <Typography variant="body1" component="h4" pt={1} sx={{lineHeight: 1.4}}>
              Use NFTs to build, grow and monetize your brand
            </Typography>
          </Grid>

          <Grid xs={12} sm={6} md={4} alignItems={{xs: 'center', sm: 'flex-start'}}>
            <Stack pt={2} gap={0.5} direction="column">
              <Typography component="h5" gutterBottom sx={{fontWeight: 'bold', fontSize: 16}}>
                Resources
              </Typography>
              <SupportLink topic="What-is-Niftgen">What is Niftgen</SupportLink>
              <SupportLink topic="What-is-Blockchain">What is Blockchain</SupportLink>
              <SupportLink topic="What-is-a-crypto-wallet">What is a crypto wallet</SupportLink>
              <SupportLink topic="Wallet-set-up-Pera-Wallet">Algorand wallet documentation</SupportLink>
              <SupportLink topic="Buying-Algos-directly-from-Pera-Wallet">How to purchase Algo’s</SupportLink>
            </Stack>
          </Grid>

          <Grid xs={12} sm={6} md={2}>
            <Stack pt={2} gap={0.5} direction="column">
              <Typography component="h5" gutterBottom sx={{fontWeight: 'bold', fontSize: 16}}>
                About Niftgen
              </Typography>
              <FooterLink>Roadmap</FooterLink>
              <FooterLink>Careers</FooterLink>
            </Stack>
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <Stack pt={2} gap={0.5} direction="column">
              <Typography component="h5" gutterBottom sx={{fontWeight: 'bold', fontSize: 16}}>
                Follow Us
              </Typography>
              <FooterLink>
                <Facebook /> Facebook
              </FooterLink>
              <FooterLink href="https://twitter.com/Niftgen" target="_blank">
                <Twitter /> Twitter
              </FooterLink>
              <FooterLink>
                <Instagram /> Instagram
              </FooterLink>
              <FooterLink>
                <Discord /> Discord
              </FooterLink>
              <FooterLink>
                <Reddit /> Reddit
              </FooterLink>
            </Stack>
          </Grid>
          <Grid xs={12}>
            <Stack
              component="section"
              direction={{sm: 'column', md: 'row'}}
              pt={{xs: 2, sm: 8}}
              alignItems="center"
              spacing={3}>
              <Copyright />
              <AlgoPrice />
              <SupportLink topic="Privacy-Policy">Privacy Policy</SupportLink>
              <SupportLink topic="Terms-of-Service">Terms of Service</SupportLink>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
