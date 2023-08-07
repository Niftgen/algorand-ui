import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import PropTypes from 'prop-types';

export function ExternalLink({children, ...props}) {
  return (
    <Link
      target="_blank"
      rel="noreferrer"
      sx={{
        paddingRight: '1.4em',
        position: 'relative',
        whiteSpace: 'nowrap',
      }}
      {...props}>
      {children}
      <Box
        sx={{
          position: 'absolute',
          display: 'inline',
          right: '0.2em',
          width: '1em',
          '& svg': {
            marginTop: '-0.1em',
            width: '0.6em',
          },
        }}>
        <OpenInNewIcon />
      </Box>
    </Link>
  );
}

ExternalLink.propTypes = {
  children: PropTypes.node.isRequired,
};
