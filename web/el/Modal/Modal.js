import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MuiModal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

export function Modal({open, onClose, Title, children}) {
  return (
    <MuiModal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: {lg: '50%', md: '70%', sm: '90%', xs: '90%'},
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
        }}>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2}}>
          <Typography variant="h5" component="h2">
            {Title}
          </Typography>
          <IconButton onClick={onClose}>
            <ClearOutlinedIcon />
          </IconButton>
        </Box>
        <Divider />

        <Box sx={{backgroundColor: 'background.paper', p: 3, maxHeight: '90vh', overflowY: 'auto'}}>{children}</Box>
      </Box>
    </MuiModal>
  );
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  Title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};
