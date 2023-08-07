import Link from '@mui/material/Link';
import {useCleanHref, useNavigate} from '@nkbt/react-router';
import PropTypes from 'prop-types';
import {useCallback, useMemo} from 'react';

export function UserLink({user, ...props}) {
  const navigate = useNavigate();
  const userQuery = useMemo(() => ({page: 'user', user: user.walletAddress}), [user.walletAddress]);
  const userHref = useCleanHref(userQuery);
  const userOnClick = useCallback(
    event => {
      event.preventDefault();
      navigate(userQuery);
    },
    [navigate, userQuery]
  );

  return user.walletAddress ? (
    <Link href={userHref} onClick={userOnClick} {...props}>
      {user.userName}
    </Link>
  ) : (
    <span>{user.userName}</span>
  );
}

UserLink.propTypes = {
  user: PropTypes.shape({
    walletAddress: PropTypes.string,
    userName: PropTypes.string,
  }).isRequired,
};
