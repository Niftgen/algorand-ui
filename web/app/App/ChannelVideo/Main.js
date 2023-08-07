import IosShareIcon from '@mui/icons-material/IosShare';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {CreatorSubscribeButton} from '@niftgen/CreatorSubscribeButton';
import {CreatorSubscriptionOptinButton} from '@niftgen/CreatorSubscriptionOptinButton';
import {ALGO, USD} from '@niftgen/currency';
import {NftRating} from '@niftgen/NftRating';
import {OnRampButton} from '@niftgen/OnRampButton';
import {PlatformSubscribeButton} from '@niftgen/PlatformSubscribeButton';
import {PlatformSubscriptionOptinButton} from '@niftgen/PlatformSubscriptionOptinButton';
import {Price} from '@niftgen/Price';
import {getSubscriptionAppStateById, getSubscriptionModuleState, useAlgoAccount} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import {useIpfs} from '@niftgen/useIpfs';
import {useNft} from '@niftgen/useNfts';
import {useVideo} from '@niftgen/useStorj';
import {useCreatorSubscriptionPrice, usePlatformSubscriptionPrice} from '@niftgen/useSubscriptionPrice';
import {useValue} from '@nkbt/react-router';

export function Main() {
  const {data: nft} = useNft({id: useValue('video')});
  const videoUrl = useVideo({id: nft.id});

  const {gateway} = useIpfs();
  const imageUrl = gateway(nft.cover);

  const creatorWallet = nft.owner.walletAddress;

  const {
    PLATFORM_SUBSCRIPTION_APP_ID,
    SUBSCRIPTION_MODULE_ID,
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

  const {userBalance, subscriptionPriceInAlgo: platformSubscriptionPriceInAlgo} = usePlatformSubscriptionPrice();
  const {subscriptionPriceInAlgo: creatorSubscriptionPriceInAlgo} = useCreatorSubscriptionPrice();

  return (
    <>
      {videoUrl.error ? (
        <Paper width="100%" height="auto" sx={{aspectRatio: '16 / 9', padding: 3}} elevation={8}>
          <Container maxWidth="sm">
            <Stack direction="column" spacing={2}>
              <Alert variant="outlined" severity="warning">
                {videoUrl.error.message}
              </Alert>

              <Typography variant="h3">Creator subscription</Typography>
              {creatorAlgoAccount.isFetched && !subscriptionModuleState.subscriptionAppId ? (
                <Alert variant="outlined" severity="warning">
                  <Typography>
                    Unfortunately creator has not enabled subscriptions yet, but you can still subscribe to the Niftgen
                    platform
                  </Typography>
                </Alert>
              ) : (
                <>
                  <Typography>
                    Subscription price is <Price currency={USD} price={MONTHLY_CREATOR_SUBSCRIPTION} /> per month (
                    <Price currency={ALGO} price={creatorSubscriptionPriceInAlgo} />)
                  </Typography>
                  <Typography>
                    Your available balance is <Price currency={ALGO} price={userBalance} />
                    {creatorSubscriptionPriceInAlgo > userBalance ? (
                      <>
                        , you need <Price currency={ALGO} price={creatorSubscriptionPriceInAlgo - userBalance} /> more
                        to subscribe
                      </>
                    ) : null}
                  </Typography>
                  <OnRampButton
                    amount={
                      creatorSubscriptionPriceInAlgo < userBalance ? 0 : creatorSubscriptionPriceInAlgo - userBalance
                    }>
                    1. Use Debit/Credit Card to fill your wallet with ALGO
                  </OnRampButton>

                  <CreatorSubscriptionOptinButton creatorWallet={creatorWallet}>
                    2. Opt-in Creator subscription
                  </CreatorSubscriptionOptinButton>
                  <CreatorSubscribeButton creatorWallet={creatorWallet}>
                    {subscriptionAppState.subscribed ? '3. Renew subscription / +30 days' : '3. Subscribe'}
                  </CreatorSubscribeButton>
                </>
              )}

              <Typography variant="h3">Platform subscription</Typography>
              <Typography>
                Subscription price is <Price currency={USD} price={MONTHLY_PLATFORM_SUBSCRIPTION} /> per month (
                <Price currency={ALGO} price={platformSubscriptionPriceInAlgo} />)
              </Typography>
              <Typography>
                Your available balance is <Price currency={ALGO} price={userBalance} />
              </Typography>
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
            </Stack>
          </Container>
        </Paper>
      ) : null}
      {!videoUrl.error && videoUrl.data ? (
        <Paper
          component="video"
          controls
          src={videoUrl.data}
          poster={imageUrl}
          width="100%"
          sx={{maxHeight: '90vh'}}
          elevation={8}
        />
      ) : null}
      {!videoUrl.error && !videoUrl.data ? (
        <Skeleton variant="rounded" width="100%" height="auto" sx={{aspectRatio: '16 / 9'}} />
      ) : null}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={3}>
          <Button variant="outlined" size="small" endIcon={<IosShareIcon />} disabled>
            Share
          </Button>
          <NftRating nft={nft} />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Button startIcon={<VisibilityIcon />} sx={{p: 1, textTransform: 'lowercase'}}>
            {nft.views === 1 ? `${nft.views} view` : `${nft.views} views`}
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
