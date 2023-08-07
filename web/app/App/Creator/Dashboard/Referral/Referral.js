import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {StatusButton} from '@niftgen/StatusButton';
import {useAccount} from '@niftgen/useAccount';
import {useCallback, useEffect, useMemo, useState} from 'react';

export function Referral() {
  const {account} = useAccount();
  const referralLink = useMemo(() => {
    const url = new URL(document.location.origin);
    url.searchParams.append('ref', account.referralCode);
    return url.href;
  }, [account.referralCode]);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [copy, setCopy] = useState(0);

  const onCopy = useCallback(() => {
    setCopy(old => old + 1);
    navigator.clipboard
      .writeText(referralLink)
      .then(() => setSuccess(true))
      .catch(e => setError(e.message));
  }, [referralLink]);

  useEffect(() => {
    if (!success || !copy) {
      return;
    }
    const timeout = setTimeout(() => setSuccess(false), 5000);
    return () => clearTimeout(timeout);
  }, [success, copy]);

  useEffect(() => {
    if (!error || !copy) {
      return;
    }
    const timeout = setTimeout(() => setError(false), 20000);
    return () => clearTimeout(timeout);
  }, [error, copy]);

  return (
    <Container>
      <Stack spacing={2} direction="row" alignItems="center">
        <Typography>Referral code: {account.referralCode}</Typography>
        <StatusButton onClick={onCopy} success={success} error={error}>
          Copy Link
        </StatusButton>
      </Stack>

      <Typography component="div">
        Instructions:
        <ul>
          <li>Step 1: Copy the link and send it to a user</li>
          <li>
            Step 2: The user needs to put the link in a browser and go to the site. If the user doesn't have an account,
            there will be steps to create one
          </li>
          <li>Step 3: The user needs to click the subscribe button on Navigation bar</li>
        </ul>
      </Typography>
    </Container>
  );
}
