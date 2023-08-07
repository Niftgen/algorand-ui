import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {ClaimRewardsButton} from '@niftgen/ClaimRewardsButton';
import {ALGO, NIFTGEN} from '@niftgen/currency';
import {NiftgenOptinButton} from '@niftgen/NiftgenOptinButton';
import {Price} from '@niftgen/Price';
import {RewardsAppOptinButton} from '@niftgen/RewardsAppOptinButton';
import {getOptinApp, useAlgoAccount} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import {useMemo} from 'react';

export function ClaimRewards() {
  const {walletAddress} = useAuth();
  const {NIFTGEN_ASSET_ID, REWARD_MODULE_ID} = useConfig();
  const userAlgoAccount = useAlgoAccount(walletAddress);
  const niftgenTokenAmount = useMemo(() => {
    const token = userAlgoAccount?.data?.assets?.find(asset => asset['asset-id'] === NIFTGEN_ASSET_ID);
    return token?.amount;
  }, [NIFTGEN_ASSET_ID, userAlgoAccount.data]);
  const rewardsAppState = getOptinApp({account: userAlgoAccount.data, appId: REWARD_MODULE_ID});

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        px: {xs: 2, md: 0},
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
      }}>
      <Paper
        elevation={8}
        sx={{
          width: {sm: '100%', md: '50%'},
          padding: {xs: 2, md: 4},
          borderRadius: 2,
        }}>
        <Stack spacing={3} direction="column">
          <Typography>
            Niftgen balance: {userAlgoAccount.isFetched ? <Price price={niftgenTokenAmount} currency={NIFTGEN} /> : '-'}
          </Typography>
          <Typography>
            Rewards balance:{' '}
            {rewardsAppState && userAlgoAccount.isFetched ? (
              <Price price={rewardsAppState.REWARDS_AMOUNT} currency={NIFTGEN} />
            ) : (
              '-'
            )}
          </Typography>
          <Typography>
            Fees to claim rewards:{' '}
            {rewardsAppState && userAlgoAccount.isFetched ? (
              <Price price={rewardsAppState.FEES_TO_PAY} currency={ALGO} />
            ) : (
              '-'
            )}
          </Typography>

          <NiftgenOptinButton>1. Opt-in Niftgen token</NiftgenOptinButton>
          <RewardsAppOptinButton>2. Opt-in Rewards application</RewardsAppOptinButton>
          <ClaimRewardsButton>3. Claim rewards</ClaimRewardsButton>
        </Stack>
      </Paper>
    </Container>
  );
}
