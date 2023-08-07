import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {useCleanHref, useNavigate} from '@nkbt/react-router';
import PropTypes from 'prop-types';
import {useCallback, useMemo} from 'react';

export function SupportLink({query, displayText}) {
  const navigate = useNavigate();
  const supportQuery = useMemo(() => ({page: 'support', ...query}), [query]);
  const supportHref = useCleanHref(supportQuery);
  const supportOnClick = useCallback(
    event => {
      event.preventDefault();
      navigate(supportQuery);
    },
    [navigate, supportQuery]
  );

  return (
    <Link href={supportHref} underline="none" onClick={supportOnClick}>
      <Paper
        elevation={4}
        sx={{
          padding: 2,
          borderRadius: 4,
          position: 'relative',
          minHeight: '11rem',
          transition: 'box-shadow .3s',
          '&:hover': {
            boxShadow: 10,
          },
        }}>
        <Typography variant="body2" component="h5" fontSize={17} fontWeight={400}>
          {displayText}
        </Typography>
        <ArrowForwardIcon sx={{position: 'absolute', bottom: 8, right: 8}} fontSize="small" />
      </Paper>
    </Link>
  );
}

SupportLink.propTypes = {
  query: PropTypes.shape().isRequired,
  displayText: PropTypes.string.isRequired,
};
