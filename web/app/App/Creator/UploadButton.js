import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import {useCleanHref, useNavigate} from '@nkbt/react-router';
import PropTypes from 'prop-types';
import {useCallback} from 'react';

export function UploadButton({to, ...props}) {
  const navigate = useNavigate();
  const onCreateVideo = useCallback(
    e => {
      if (e.type === 'click') {
        e.preventDefault();
        navigate({creator: to});
      }
    },
    [navigate, to]
  );
  const href = useCleanHref({creator: to});

  return <Button component={Link} size="small" variant="outlined" onClick={onCreateVideo} href={href} {...props} />;
}

UploadButton.propTypes = {
  to: PropTypes.string.isRequired,
};
