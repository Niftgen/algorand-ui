import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {useTiktok} from '@niftgen/useTiktok';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import intlFormat from 'date-fns/intlFormat';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import sub from 'date-fns/sub';
import PropTypes from 'prop-types';

export function SubscriptionExpiryDate({expiryDate}) {
  const now = useTiktok(60_000);

  if (!expiryDate) {
    return null;
  }

  const exactDate = intlFormat(expiryDate, {year: 'numeric', month: 'numeric', day: 'numeric'});
  const title = <Typography>Active until: {exactDate}</Typography>;
  if (isBefore(now, expiryDate)) {
    return (
      <Alert variant="outlined" severity="success">
        <AlertTitle>Subscription active</AlertTitle>
        <Tooltip arrow placement="top" title={title}>
          <Typography>Active for: {formatDistanceStrict(expiryDate, now)}</Typography>
        </Tooltip>
      </Alert>
    );
  }

  if (isAfter(now, sub(expiryDate, {days: 7}))) {
    return (
      <Alert variant="outlined" severity="warning">
        <AlertTitle>Subscription will end soon</AlertTitle>
        <Tooltip arrow placement="top" title={title}>
          <Typography>Active for: {formatDistanceStrict(expiryDate, now)}</Typography>
        </Tooltip>
      </Alert>
    );
  }

  if (isAfter(now, expiryDate)) {
    return (
      <Alert variant="outlined" severity="error">
        <AlertTitle>Subscription active</AlertTitle>
        <Tooltip arrow placement="top" title={title}>
          <Typography>Expired for: {formatDistanceStrict(expiryDate, now)}</Typography>
        </Tooltip>
      </Alert>
    );
  }

  return null;
}

SubscriptionExpiryDate.propTypes = {
  expiryDate: PropTypes.instanceOf(Date),
};
