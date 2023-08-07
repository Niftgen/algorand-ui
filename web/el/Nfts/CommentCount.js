import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

export function CommentCount({count}) {
  return (
    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <ModeCommentOutlinedIcon fontSize="small" />

      <Typography variant="body2" color="text.secondary" lineHeight={1.8} sx={{pl: 0.5}}>
        {count}
      </Typography>
    </Box>
  );
}

CommentCount.propTypes = {
  count: PropTypes.number.isRequired,
};
