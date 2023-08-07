import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import {compileFragments} from '@niftgen/compileFragments';
import {accountFragment} from '@niftgen/fragments.account';
import ToggleButtonGroup from '@niftgen/ToggleButtonGroup';
import {UploadImage} from '@niftgen/UploadImage';
import {useAccount} from '@niftgen/useAccount';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import {useLookups} from '@niftgen/useLookups';
import {useUpload} from '@niftgen/useUpload';
import {useCallback, useEffect, useRef, useState} from 'react';
import addUserQuery from './addUser.graphql';

async function addUser({api, apikey, token, walletAddress, email, userName, avatarPath, interests, dateOfBirth}) {
  const response = await window.fetch(`${api}/graphql`, {
    method: 'POST',
    headers: {
      'x-api-key': apikey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: compileFragments(addUserQuery, accountFragment),
      variables: {walletAddress, email, userName, avatarPath, interests, dateOfBirth},
    }),
  });

  const {data, errors} = await response.json();
  if (data?.addUser) {
    return data?.addUser;
  }
  throw new Error(errors?.[0]?.message || 'Unknown server error');
}

export function Signup() {
  const {api, apikey} = useConfig();
  const {walletAddress, token, provider} = useAuth();
  const {account, update} = useAccount();
  const {lookups} = useLookups();

  const [isUpdating, setIsUpdating] = useState(false);

  const [email, setEmail] = useState(provider === 'Magic' ? window.localStorage.getItem('email') : account.email);
  useEffect(() => {
    if (account.email) {
      setEmail(account.email);
    }
  }, [account.email]);

  const [userName, setUserName] = useState(account.userName);
  useEffect(() => {
    if (account.userName) {
      setUserName(account.userName);
    }
  }, [account.userName]);

  const [interests, setInterests] = useState(account.interests.map(({id}) => id));
  useEffect(() => {
    setInterests(account.interests.map(({id}) => id));
  }, [account.interests]);

  const [dateOfBirth, setDateOfBirth] = useState(account.dateOfBirth);
  const [accept, setAccept] = useState(false);
  const [coverFile, setCoverFile] = useState();

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const {upload: ipfsUpload} = useUpload();

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();
      const isValid = event.target.reportValidity();
      if (!api || !apikey || !walletAddress || !token || !isValid) {
        return;
      }

      setIsUpdating(true);

      async function run() {
        const ipfsPath = coverFile ? await ipfsUpload(coverFile) : undefined;
        const user = await addUser({
          api,
          apikey,
          token,
          walletAddress,
          email,
          userName,
          interests,
          dateOfBirth,
          avatarPath: ipfsPath,
        });
        if (isMounted.current) {
          setIsUpdating(false);
          if (user) {
            update(user);
          }
        }
      }

      run().catch(e => {
        console.error(e);
        if (isMounted.current) {
          setIsUpdating(false);
        }
      });
    },
    [api, apikey, walletAddress, token, ipfsUpload, coverFile, email, userName, interests, dateOfBirth, update]
  );

  const onEmailChange = useCallback(({target: {value}}) => setEmail(value), []);
  const onUsernameChange = useCallback(({target: {value}}) => setUserName(value), []);
  const onInterestsChange = useCallback((event, value) => setInterests(value), []);

  const onDateChange = useCallback(event => {
    setDateOfBirth(event.target.value);
  }, []);

  const onAcceptChange = useCallback(event => {
    setAccept(Boolean(event.target.checked));
  }, []);

  return (
    <Paper
      elevation={8}
      sx={{
        padding: {xs: 2, md: 4},
        borderRadius: 2,
      }}>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{maxWidth: 'sm'}}>
        <Grid container spacing={2} gap={1}>
          <Grid item xs={12} onClick={() => navigator.clipboard.writeText(walletAddress)} sx={{cursor: 'pointer'}}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <TextField
                disabled
                fullWidth
                name="walletAddress"
                label="Wallet Address"
                type="text"
                id="walletAddress"
                value={walletAddress}
              />
              <ContentCopyOutlinedIcon sx={{ml: 1}} />
            </Stack>
          </Grid>{' '}
          {provider === 'Magic' ? (
            <Grid item xs={12}>
              <TextField
                disabled
                fullWidth
                id="email"
                label="Email Address"
                type="email"
                name="email"
                value={email || ''}
              />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                type="email"
                name="email"
                autoComplete="email"
                value={email || ''}
                onChange={onEmailChange}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="username"
              label="Username"
              type="text"
              id="username"
              autoComplete="username"
              value={userName || ''}
              onChange={onUsernameChange}
            />
          </Grid>
          <Grid item xs={12}>
            <UploadImage coverFile={coverFile} onCoverFileChange={setCoverFile} ipfsPath={account.avatarPath} />
          </Grid>
          <Grid item>
            <FormControl fullWidth component="fieldset">
              <FormLabel component="legend" sx={{fontSize: 14, mb: 1}}>
                What are you interested in?
              </FormLabel>
              <ToggleButtonGroup value={interests} onChange={onInterestsChange}>
                {lookups.interests.map(({id, description}) => (
                  <ToggleButton key={id} value={id}>
                    {description}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth component="fieldset" required>
              <TextField
                id="dateOfBirth"
                name="dateOfBirth"
                label="Date of birth (must be over 14yrs)"
                type="date"
                value={dateOfBirth || ''}
                onChange={onDateChange}
                required
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              sx={{alignItems: 'normal'}}
              control={
                <Checkbox
                  value="accept"
                  sx={{py: 0, alignItems: 'normal'}}
                  name="accept"
                  required
                  checked={accept}
                  onChange={onAcceptChange}
                />
              }
              label={
                <Typography>
                  I have read and accept the{' '}
                  <Link href="#" underline="always">
                    terms of service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" underline="always">
                    privacy policy
                  </Link>
                </Typography>
              }
            />
          </Grid>
        </Grid>
        <Box sx={{textAlign: 'center', pt: 3}}>
          <LoadingButton size="large" type="submit" variant="contained" loading={isUpdating}>
            Complete Sign up
          </LoadingButton>
        </Box>
      </Box>
    </Paper>
  );
}
