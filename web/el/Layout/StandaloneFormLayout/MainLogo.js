import Link from '@mui/material/Link';
import {Logo} from '@niftgen/Logo';
import {StateContext, useRemove} from '@nkbt/react-router';
import {useCallback, useContext} from 'react';

export function MainLogo() {
  const router = useContext(StateContext);
  const removeParams = useRemove();
  const onClick = useCallback(
    e => {
      e.preventDefault();
      removeParams(router.query);
    },
    [removeParams, router.query]
  );

  return (
    <Link onClick={onClick} href="/" sx={{display: 'block', height: 50}}>
      <Logo height="100%" />
    </Link>
  );
}
