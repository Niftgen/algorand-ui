import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import {CreatorSubscribeButton} from '@niftgen/CreatorSubscribeButton';
import {CreatorSubscriptionOptinButton} from '@niftgen/CreatorSubscriptionOptinButton';
import {ALGO, USD} from '@niftgen/currency';
import {OnRampButton} from '@niftgen/OnRampButton';
import {PlatformSubscribeButton} from '@niftgen/PlatformSubscribeButton';
import {PlatformSubscriptionOptinButton} from '@niftgen/PlatformSubscriptionOptinButton';
import {Price} from '@niftgen/Price';
import {SubscriptionExpiryDate} from '@niftgen/SubscriptionExpiryDate';
import {getSubscriptionAppStateById, getSubscriptionModuleState, useAlgoAccount} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import {useCreatorSubscriptionPrice, usePlatformSubscriptionPrice} from '@niftgen/useSubscriptionPrice';
import {useAdd, useNavigate, useRemove, useValue} from '@nkbt/react-router';
import PropTypes from 'prop-types';
import {useCallback, useEffect} from 'react';

export function Subscribe({creatorWallet, onCancel, onSuccess}) {
  const {
    SUBSCRIPTION_MODULE_ID,
    PLATFORM_SUBSCRIPTION_APP_ID,
    MONTHLY_CREATOR_SUBSCRIPTION,
    MONTHLY_PLATFORM_SUBSCRIPTION,
  } = useConfig();
  const {walletAddress} = useAuth();

  const creatorAlgoAccount = useAlgoAccount(creatorWallet);
  const userAlgoAccount = useAlgoAccount(walletAddress);

  const subscriptionModuleState = getSubscriptionModuleState(SUBSCRIPTION_MODULE_ID, creatorAlgoAccount.data);
  const subscriptionAppState = getSubscriptionAppStateById(
    subscriptionModuleState.subscriptionAppId,
    userAlgoAccount.data
  );
  const platformAppState = getSubscriptionAppStateById(PLATFORM_SUBSCRIPTION_APP_ID, userAlgoAccount.data);

  const onSubmit = useCallback(
    event => {
      event.preventDefault();
      if (subscriptionAppState.subscribed) {
        return onSuccess();
      }
      return onCancel();
    },
    [subscriptionAppState, onCancel, onSuccess]
  );

  const tab = useValue('tab') || 'creator';
  const removeParams = useRemove();
  const addParams = useAdd();
  useEffect(() => {
    const defaultParams = {tab: 'creator'};
    addParams(defaultParams);
    return () => {
      removeParams(defaultParams);
    };
  }, [addParams, removeParams]);

  const navigate = useNavigate();
  const onTabChange = useCallback(
    (_e, value) => {
      navigate({tab: value});
    },
    [navigate]
  );

  const {userBalance, subscriptionPriceInAlgo: platformSubscriptionPriceInAlgo} = usePlatformSubscriptionPrice();
  const {subscriptionPriceInAlgo: creatorSubscriptionPriceInAlgo} = useCreatorSubscriptionPrice();

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
          {subscriptionAppState.subscribed ? 'Your subscription' : 'Confirm Subscription'}
        </Typography>
        <IconButton onClick={onCancel}>
          <ClearOutlinedIcon />
        </IconButton>
      </Box>
      <Tabs value={['creator', 'platform'].includes(tab) ? tab : null} onChange={onTabChange}>
        <Tab value={null} sx={{opacity: 0, maxWidth: 0, minWidth: 0, p: 0}} />
        <Tab value="creator" label="Creator" />
        <Tab value="platform" label="Platform" />
      </Tabs>
      <Divider />
      <Stack
        direction="column"
        component="form"
        noValidate
        onSubmit={onSubmit}
        sx={{backgroundColor: 'background.paper', p: 3, maxHeight: '90vh', overflowY: 'auto'}}
        spacing={2}>
        {tab === 'creator' ? (
          <>
            <Typography>
              Subscription price is <Price currency={USD} price={MONTHLY_CREATOR_SUBSCRIPTION} /> per month (
              <Price currency={ALGO} price={creatorSubscriptionPriceInAlgo} />)
            </Typography>
            <Typography>
              Your available balance is <Price currency={ALGO} price={userBalance} />
              {creatorSubscriptionPriceInAlgo > userBalance ? (
                <>
                  , you need <Price currency={ALGO} price={creatorSubscriptionPriceInAlgo - userBalance} /> more to
                  subscribe
                </>
              ) : null}
            </Typography>
            <SubscriptionExpiryDate expiryDate={subscriptionAppState.expiryDate} />

            {creatorAlgoAccount.isFetched && !subscriptionModuleState.subscriptionAppId ? (
              <Alert variant="outlined" severity="warning">
                <Typography>
                  Unfortunately creator has not enabled subscriptions yet, but you can still subscribe to the Niftgen
                  platform
                </Typography>
              </Alert>
            ) : null}

            <OnRampButton
              amount={creatorSubscriptionPriceInAlgo < userBalance ? 0 : creatorSubscriptionPriceInAlgo - userBalance}>
              1. Use Debit/Credit Card to fill your wallet with ALGO
            </OnRampButton>

            <CreatorSubscriptionOptinButton creatorWallet={creatorWallet}>
              2. Opt-in Creator subscription
            </CreatorSubscriptionOptinButton>
            <CreatorSubscribeButton creatorWallet={creatorWallet}>
              {subscriptionAppState.subscribed ? '3. Renew subscription / +30 days' : '3. Subscribe'}
            </CreatorSubscribeButton>
          </>
        ) : null}

        {tab === 'platform' ? (
          <>
            <Typography>
              Subscription price is <Price currency={USD} price={MONTHLY_PLATFORM_SUBSCRIPTION} /> per month (
              <Price currency={ALGO} price={platformSubscriptionPriceInAlgo} />)
            </Typography>
            <Typography>
              Your available balance is <Price currency={ALGO} price={userBalance} />
            </Typography>
            <SubscriptionExpiryDate expiryDate={platformAppState.expiryDate} />

            <OnRampButton
              amount={
                platformSubscriptionPriceInAlgo < userBalance ? 0 : platformSubscriptionPriceInAlgo - userBalance
              }>
              1. Use Debit/Credit Card to fill your wallet with ALGO
            </OnRampButton>

            <PlatformSubscriptionOptinButton>2. Opt-in Platform subscription</PlatformSubscriptionOptinButton>

            <PlatformSubscribeButton disabled={platformSubscriptionPriceInAlgo > userBalance}>
              {platformAppState.subscribed ? '3. Renew subscription / +30 days' : '3. Subscribe'}
            </PlatformSubscribeButton>
          </>
        ) : null}

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button type="submit" variant="contained">
            {subscriptionAppState.subscribed ? 'Continue' : 'Cancel'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

Subscribe.propTypes = {
  creatorWallet: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
