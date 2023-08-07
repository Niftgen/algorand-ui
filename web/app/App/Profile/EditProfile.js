import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import {compileFragments} from '@niftgen/compileFragments';
import {accountFragment} from '@niftgen/fragments.account';
import ToggleButtonGroup from '@niftgen/ToggleButtonGroup';
import {UploadImage} from '@niftgen/UploadImage';
import {useAccount} from '@niftgen/useAccount';
import {useAuth} from '@niftgen/useAuth';
import {useFetch} from '@niftgen/useFetch';
import {useLookups} from '@niftgen/useLookups';
import {useUpload} from '@niftgen/useUpload';
import formatISO from 'date-fns/formatISO';
import {useCallback, useEffect, useRef, useState} from 'react';
import editUserQuery from './editUser.graphql';

async function editUser({
  fetch,
  walletAddress,
  userName,
  avatarPath,
  dateOfBirth,
  types,
  interests,
  bio,
  twitterUrl,
  instagramUrl,
  discordUrl,
  facebookUrl,
  metadata,
}) {
  const response = await fetch(`/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: compileFragments(editUserQuery, accountFragment),
      variables: {
        walletAddress,
        userName,
        dateOfBirth,
        types,
        interests,
        avatarPath,
        bio,
        twitterUrl,
        instagramUrl,
        discordUrl,
        facebookUrl,
        metadata,
      },
    }),
  });

  const {
    data: {editUser: user},
  } = await response.json();

  return user;
}

export function EditProfile() {
  const {fetch} = useFetch();
  const {account, update} = useAccount();
  const {walletAddress} = useAuth();
  const {lookups} = useLookups();
  const [isUpdating, setIsUpdating] = useState(false);

  const [dateOfBirth, setDateOfBirth] = useState(account.dateOfBirth);
  useEffect(() => {
    setDateOfBirth(account.dateOfBirth);
  }, [account.dateOfBirth]);

  const [userName, setUserName] = useState(account.userName);
  useEffect(() => {
    setUserName(account.userName);
  }, [account.userName]);

  const [types, setTypes] = useState(account.types.map(({id}) => id));
  useEffect(() => {
    setTypes(account.types.map(({id}) => id));
  }, [account.types]);

  const [interests, setInterests] = useState(account.interests.map(({id}) => id));
  useEffect(() => {
    setInterests(account.interests.map(({id}) => id));
  }, [account.interests]);

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [bio, setBio] = useState(account.bio);
  useEffect(() => {
    setBio(account.bio);
  }, [account.bio]);
  const onBioChange = useCallback(({target: {value}}) => setBio(value), []);

  const [callsEnabled, setCallsEnabled] = useState(account.metadata.callsEnabled);
  useEffect(() => {
    setCallsEnabled(account.metadata.callsEnabled);
  }, [account.metadata.callsEnabled]);
  const onCallsEnabled = useCallback(({target: {checked}}) => setCallsEnabled(checked), []);

  const [cal, setCal] = useState(account.metadata.cal);
  useEffect(() => {
    setCal(account.metadata.cal);
  }, [account.metadata.cal]);
  const onCalChange = useCallback(({target: {value}}) => setCal(value), []);

  const [twitterUrl, setTwitterUrl] = useState(account.twitterUrl);
  useEffect(() => {
    setTwitterUrl(account.twitterUrl);
  }, [account.twitterUrl]);
  const onTwitterUrlChange = useCallback(({target: {value}}) => setTwitterUrl(value), []);

  const [instagramUrl, setInstagramUrl] = useState(account.instagramUrl);
  useEffect(() => {
    setInstagramUrl(account.instagramUrl);
  }, [account.instagramUrl]);
  const onInstagramUrlChange = useCallback(({target: {value}}) => setInstagramUrl(value), []);

  const [discordUrl, setDiscordUrl] = useState(account.discordUrl);
  useEffect(() => {
    setDiscordUrl(account.discordUrl);
  }, [account.discordUrl]);
  const onDiscordUrlChange = useCallback(({target: {value}}) => setDiscordUrl(value), []);

  const [facebookUrl, setFacebookUrl] = useState(account.facebookUrl);
  useEffect(() => {
    setFacebookUrl(account.facebookUrl);
  }, [account.facebookUrl]);
  const onFacebookUrlChange = useCallback(({target: {value}}) => setFacebookUrl(value), []);

  const [coverFile, setCoverFile] = useState();
  const {upload: ipfsUpload} = useUpload();
  const onSubmit = useCallback(
    event => {
      event.preventDefault();

      document.querySelector('#twitterUrl').setCustomValidity('');
      if (twitterUrl) {
        try {
          const url = new URL(twitterUrl);
          if (url.hostname !== 'twitter.com') {
            document.querySelector('#twitterUrl').setCustomValidity('Must be "twitter.com" link');
          }
        } catch (err) {
          document.querySelector('#twitterUrl').setCustomValidity('Invalid URL');
        }
      }

      document.querySelector('#instagramUrl').setCustomValidity('');
      if (instagramUrl) {
        try {
          const url = new URL(instagramUrl);
          if (url.hostname !== 'instagram.com') {
            document.querySelector('#instagramUrl').setCustomValidity('Must be "instagram.com" link');
          }
        } catch (err) {
          document.querySelector('#instagramUrl').setCustomValidity('Invalid URL');
        }
      }

      document.querySelector('#discordUrl').setCustomValidity('');
      if (discordUrl) {
        try {
          new URL(discordUrl);
          const url = new URL(discordUrl);
          if (url.hostname !== 'discord.com') {
            document.querySelector('#discordUrl').setCustomValidity('Must be "discord.com" link');
          }
        } catch (err) {
          document.querySelector('#discordUrl').setCustomValidity('Invalid URL');
        }
      }

      document.querySelector('#facebookUrl').setCustomValidity('');
      if (facebookUrl) {
        try {
          const url = new URL(facebookUrl);
          if (url.hostname !== 'facebook.com') {
            document.querySelector('#facebookUrl').setCustomValidity('Must be "facebook.com" link');
          }
        } catch (err) {
          document.querySelector('#facebookUrl').setCustomValidity('Invalid URL');
        }
      }

      document.querySelector('#cal').setCustomValidity('');
      if (cal) {
        try {
          const url = new URL(cal);
          if (url.hostname !== 'cal.com') {
            document.querySelector('#cal').setCustomValidity('Must be "cal.com" link');
          }
        } catch (err) {
          document.querySelector('#cal').setCustomValidity('Invalid URL');
        }
      }

      const isValid = event.target.reportValidity();
      if (!fetch) {
        return;
      }
      if (!walletAddress) {
        return;
      }
      if (!isValid) {
        return;
      }

      setIsUpdating(true);

      async function run() {
        const ipfsPath = coverFile ? await ipfsUpload(coverFile) : account.avatarPath;
        const user = await editUser({
          fetch,
          walletAddress,
          userName,
          avatarPath: ipfsPath,
          dateOfBirth,
          types,
          interests,
          bio,
          twitterUrl,
          instagramUrl,
          discordUrl,
          facebookUrl,
          metadata: JSON.stringify({
            ...account.metadata,
            callsEnabled,
            cal,
          }),
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
    [
      twitterUrl,
      instagramUrl,
      discordUrl,
      facebookUrl,
      fetch,
      walletAddress,
      coverFile,
      ipfsUpload,
      account.avatarPath,
      account.metadata,
      userName,
      dateOfBirth,
      types,
      interests,
      bio,
      callsEnabled,
      cal,
      update,
    ]
  );

  const onUsernameChange = useCallback(({target: {value}}) => setUserName(value), []);
  const onTypesChange = useCallback((event, value) => setTypes(value), []);
  const onInterestsChange = useCallback((event, value) => setInterests(value), []);

  const onDateChange = useCallback(event => {
    const dob = event.target.value ? new Date(event.target.value) : null;
    setDateOfBirth(dob ? formatISO(dob, {representation: 'date'}) : null);
  }, []);

  return (
    <Box component="form" noValidate onSubmit={onSubmit} sx={{my: 2.5}}>
      <Grid container spacing={3}>
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
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
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

        <Grid item xs={12}>
          <FormControl component="fieldset" sx={{width: '50%'}}>
            <TextField
              id="dateOfBirth"
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
          <label htmlFor="bio">
            <FormLabel component="legend" sx={{mb: 1}}>
              Bio
            </FormLabel>
            <TextField fullWidth multiline id="bio" name="bio" value={bio || ''} onChange={onBioChange} minRows={10} />
          </label>
        </Grid>

        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={callsEnabled} onChange={onCallsEnabled} />}
              label="Allow subscribers to book a call with you"
            />
          </FormGroup>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="cal"
            name="cal"
            value={cal || ''}
            onChange={onCalChange}
            label="Cal.com link"
            type="text"
          />
          <Typography sx={{mt: 1}}>
            e.g. https://cal.com/username,{' '}
            <Link href="https://cal.com/signup" target="_blank" rel="noreferrer">
              sign up to cal.com
            </Link>
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="twitterUrl"
            name="twitterUrl"
            value={twitterUrl || ''}
            onChange={onTwitterUrlChange}
            label="Twitter URL (optional)"
            type="text"
          />
          <Typography sx={{mt: 1}}>e.g. https://twitter.com/username</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="instagramUrl"
            name="instagramUrl"
            value={instagramUrl || ''}
            onChange={onInstagramUrlChange}
            label="Instagram URL (optional)"
            type="text"
          />
          <Typography sx={{mt: 1}}>e.g. https://instagram.com/username</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="discordUrl"
            name="discordUrl"
            value={discordUrl || ''}
            onChange={onDiscordUrlChange}
            label="Discord URL (optional)"
            type="text"
          />
          <Typography sx={{mt: 1}}>e.g. https://discord.com/invite</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="facebookUrl"
            name="facebookUrl"
            value={facebookUrl || ''}
            onChange={onFacebookUrlChange}
            label="Facebook URL (optional)"
            type="text"
          />
          <Typography sx={{mt: 1}}>e.g. https://facebook.com/group/groupname</Typography>
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{mb: 2}}>
              Are you a
            </FormLabel>
            <ToggleButtonGroup fullWidth value={types} onChange={onTypesChange}>
              {lookups.types.map(({id, description}) => (
                <ToggleButton key={id} value={id}>
                  {description}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{mb: 2}}>
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
          <Divider sx={{mb: 2}} />
          <LoadingButton size="large" type="submit" variant="contained" loading={isUpdating}>
            Save changes
          </LoadingButton>
        </Grid>
      </Grid>
    </Box>
  );
}
