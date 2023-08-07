import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {renderDate} from '@niftgen/renderDate';
import PropTypes from 'prop-types';

export function NotificationAction({notification, onDelete}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        py: 0.5,
        pl: 1,
      }}>
      <Typography variant="body2" sx={{lineHeight: '20px', color: '#6D639E', whiteSpace: 'nowrap'}}>
        {renderDate({timestamp: notification.createdAt})}
      </Typography>
      <IconButton onClick={onDelete} sx={{p: 0}}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}

NotificationAction.propTypes = {
  notification: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};
