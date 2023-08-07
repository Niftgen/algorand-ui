import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DownloadingIcon from '@mui/icons-material/Downloading';
import WarningIcon from '@mui/icons-material/Warning';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {CreatorSubscribeButton} from '@niftgen/CreatorSubscribeButton';
import {Logo} from '@niftgen/Logo';
import {PlatformSubscribeButton} from '@niftgen/PlatformSubscribeButton';
import {renderDate} from '@niftgen/renderDate';
import {getAllSubscriptionAppState, useAlgoAccount} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import {useIpfs} from '@niftgen/useIpfs';
import {useProfile} from '@niftgen/useProfile';
import {UserLink} from '@niftgen/UserLink';
import formatRelative from 'date-fns/formatRelative';
import PropTypes from 'prop-types';
import {useMemo} from 'react';

const SubscriptionPropType = PropTypes.shape({
  subscriptionAppId: PropTypes.number.isRequired,
  creatorAddress: PropTypes.string,
  optin: PropTypes.bool.isRequired,
  subscribed: PropTypes.bool.isRequired,
  expiryDate: PropTypes.instanceOf(Date),
  activeSubscription: PropTypes.bool.isRequired,
  amount: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
});

export function SubscriptionRow({subscription}) {
  const {data: creator} = useProfile({walletAddress: subscription.creatorAddress});
  const {gateway} = useIpfs();
  if (!creator) {
    return <SubscriptionSkeleton />;
  }
  return (
    <TableRow sx={{'& td': {border: 0, whiteSpace: 'nowrap'}}}>
      <TableCell scope="row" sx={{width: 50}}>
        <Avatar alt={creator.userName} variant="rounded" src={gateway(creator.avatarPath)} sx={{borderRadius: 1}} />
      </TableCell>

      <TableCell>
        <UserLink user={creator} />
      </TableCell>

      <TableCell align="center" sx={{width: 50}}>
        {subscription.activeSubscription ? <CheckCircleOutlineIcon color="success" /> : <WarningIcon color="warn" />}
      </TableCell>

      <TableCell align="right" sx={{width: 150}}>
        {formatRelative(subscription.expiryDate, new Date())}
      </TableCell>
      <TableCell>
        <CreatorSubscribeButton creatorWallet={subscription.creatorAddress}>Renew</CreatorSubscribeButton>
      </TableCell>
    </TableRow>
  );
}

SubscriptionRow.propTypes = {
  subscription: SubscriptionPropType.isRequired,
};

export function PlatformSubscriptionRow({subscription}) {
  return (
    <TableRow sx={{'& td': {border: 0, whiteSpace: 'nowrap'}}}>
      <TableCell scope="row" sx={{width: 50}}>
        <Logo height="40px" />
      </TableCell>

      <TableCell>NIFTGEN Platform</TableCell>

      <TableCell align="center" sx={{width: 50}}>
        {subscription.activeSubscription ? <CheckCircleOutlineIcon color="success" /> : <WarningIcon color="warn" />}
      </TableCell>

      <TableCell align="right" sx={{width: 150}}>
        {renderDate({timestamp: subscription.expiryDate})}
      </TableCell>
      <TableCell>
        <PlatformSubscribeButton>Renew</PlatformSubscribeButton>
      </TableCell>
    </TableRow>
  );
}

PlatformSubscriptionRow.propTypes = {
  subscription: SubscriptionPropType.isRequired,
};

export function SubscriptionSkeleton() {
  return (
    <TableRow sx={{'& td': {border: 0, whiteSpace: 'nowrap'}}}>
      <TableCell scope="row" sx={{width: 50}}>
        <Skeleton variant="rounded" width="100%" height={70} sx={{aspectRatio: '16 / 9'}} />
      </TableCell>
      <TableCell>
        <DownloadingIcon />
      </TableCell>
      <TableCell>&nbsp;</TableCell>
      <TableCell>&nbsp;</TableCell>
      <TableCell>&nbsp;</TableCell>
    </TableRow>
  );
}

export function MySubscriptions() {
  const {walletAddress} = useAuth();
  const userAlgoAccount = useAlgoAccount(walletAddress);
  const subscriptions = useMemo(() => getAllSubscriptionAppState(userAlgoAccount.data), [userAlgoAccount.data]);
  const {PLATFORM_SUBSCRIPTION_APP_ID} = useConfig();

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
      <TableContainer>
        <Table sx={{minWidth: 600}}>
          <TableHead>
            <TableRow sx={{'& th': {border: 0, whiteSpace: 'nowrap'}}}>
              <TableCell>Creator</TableCell>
              <TableCell>&nbsp;</TableCell>
              <TableCell align="center" sx={{width: 50}}>
                Status
              </TableCell>
              <TableCell align="right" sx={{width: 150}}>
                Expiration date
              </TableCell>
              <TableCell>&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userAlgoAccount.isFetching ? <SubscriptionSkeleton /> : null}
            {subscriptions
              .filter(subscription => PLATFORM_SUBSCRIPTION_APP_ID === subscription.subscriptionAppId)
              .map(subscription => (
                <PlatformSubscriptionRow key={subscription.subscriptionAppId} subscription={subscription} />
              ))}
            {subscriptions
              .filter(subscription => PLATFORM_SUBSCRIPTION_APP_ID !== subscription.subscriptionAppId)
              .map(subscription => (
                <SubscriptionRow key={subscription.subscriptionAppId} subscription={subscription} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
