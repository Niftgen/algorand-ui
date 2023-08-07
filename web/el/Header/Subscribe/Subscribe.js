import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {ALGO, USD} from '@niftgen/currency';
import {OnRampButton} from '@niftgen/OnRampButton';
import {PlatformSubscribeButton} from '@niftgen/PlatformSubscribeButton';
import {PlatformSubscriptionOptinButton} from '@niftgen/PlatformSubscriptionOptinButton';
import {Price} from '@niftgen/Price';
import {SubscriptionExpiryDate} from '@niftgen/SubscriptionExpiryDate';
import {getSubscriptionAppStateById, useAlgoAccount} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import {usePlatformSubscriptionPrice} from '@niftgen/useSubscriptionPrice';
import PropTypes from 'prop-types';
import {useCallback} from 'react';

export function Subscribe({onCancel, onSuccess}) {
  const {PLATFORM_SUBSCRIPTION_APP_ID, MONTHLY_PLATFORM_SUBSCRIPTION} = useConfig();
  const {walletAddress} = useAuth();
  const userAlgoAccount = useAlgoAccount(walletAddress);
  const platformAppState = getSubscriptionAppStateById(PLATFORM_SUBSCRIPTION_APP_ID, userAlgoAccount.data);

  const onSubmit = useCallback(
    event => {
      event.preventDefault();
      if (platformAppState.subscribed) {
        return onSuccess();
      }
      return onCancel();
    },
    [platformAppState.subscribed, onCancel, onSuccess]
  );

  const {userBalance, subscriptionPriceInAlgo} = usePlatformSubscriptionPrice();

  return (
    <Box
      maxWidth="sm"
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: {lg: '30%', md: '50%', sm: '70%', xs: '90%'},
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 2,
      }}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2}}>
        <Typography variant="h5" component="h2" color="niftgen.black">
          {platformAppState.subscribed ? 'Your subscription' : 'Confirm Subscription'}
        </Typography>
        <IconButton onClick={onCancel}>
          <ClearOutlinedIcon />
        </IconButton>
      </Box>
      <Stack
        direction="column"
        component="form"
        noValidate
        onSubmit={onSubmit}
        sx={{backgroundColor: 'background.paper', p: 3, maxHeight: '90vh', overflowY: 'auto'}}
        spacing={2}>
        <>
          <Typography>
            Subscription price is <Price currency={USD} price={MONTHLY_PLATFORM_SUBSCRIPTION} /> per month (
            <Price currency={ALGO} price={subscriptionPriceInAlgo} />)
          </Typography>
          <Typography>
            Your available balance is <Price currency={ALGO} price={userBalance} />
            {subscriptionPriceInAlgo > userBalance ? (
              <>
                , you need <Price currency={ALGO} price={subscriptionPriceInAlgo - userBalance} /> more to subscribe
              </>
            ) : null}
          </Typography>
          <SubscriptionExpiryDate expiryDate={platformAppState.expiryDate} />
          <OnRampButton amount={subscriptionPriceInAlgo < userBalance ? 0 : subscriptionPriceInAlgo - userBalance}>
            1. Use Debit/Credit Card to fill your wallet with ALGO
          </OnRampButton>
          <PlatformSubscriptionOptinButton>2. Opt-in Platform subscription</PlatformSubscriptionOptinButton>
          <PlatformSubscribeButton disabled={subscriptionPriceInAlgo > userBalance}>
            {platformAppState.subscribed ? '3. Renew subscription / +30 days' : '3. Subscribe'}
          </PlatformSubscribeButton>
        </>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button type="submit" variant="contained">
            {platformAppState.subscribed ? 'Continue' : 'Cancel'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

Subscribe.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
