import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorIcon from '@mui/icons-material/Error';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

export function StatusIcon({blocked, loading, success, error}) {
  if (error) {
    return <ErrorIcon color="error" />;
  }
  if (blocked) {
    return <BlockIcon color="error" />;
  }
  if (loading) {
    return <CircularProgress color="inherit" size={12} />;
  }
  if (success) {
    return <CheckCircleOutlineIcon color="success" />;
  }
  return undefined;
}

StatusIcon.propTypes = {
  loading: PropTypes.bool.isRequired,
  blocked: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export function StatusButton({blocked, loading, success, error, children, ...rest}) {
  return (
    <Tooltip placement="bottom-start" title={error ? <Typography whiteSpace="pre-wrap">{error}</Typography> : null}>
      <Box>
        <Button
          variant="outlined"
          color={error ? 'error' : 'primary'}
          sx={{justifyContent: 'space-between'}}
          endIcon={<StatusIcon {...{blocked, loading, success, error}} />}
          data-blocked={blocked}
          data-loading={loading}
          data-success={success}
          data-error={error}
          {...rest}>
          {children}
        </Button>
      </Box>
    </Tooltip>
  );
}

StatusButton.propTypes = {
  ...StatusIcon.propTypes,
  children: PropTypes.node.isRequired,
};
StatusButton.defaultProps = {
  loading: false,
  blocked: false,
  success: false,
  error: '',
};
