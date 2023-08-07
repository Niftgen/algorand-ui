import Cal from '@calcom/embed-react';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import {StatusButton} from '@niftgen/StatusButton';
import {useAccount} from '@niftgen/useAccount';
import {useAuth} from '@niftgen/useAuth';
import {useProfile} from '@niftgen/useProfile';
import PropTypes from 'prop-types';
import {useMemo, useState} from 'react';

export function Calendar({creatorWallet}) {
  const {data: creator} = useProfile({walletAddress: creatorWallet});
  const {account} = useAccount();
  const {walletAddress} = useAuth();
  const [open, setOpen] = useState(false);
  const calLink = useMemo(() => {
    try {
      const url = new URL(creator.metadata.cal);
      const [, username] = url.pathname.split('/');

      return username;
    } catch (e) {
      // whatever
    }
  }, [creator.metadata.cal]);

  return (
    <>
      <StatusButton
        disabled={!calLink || creatorWallet === walletAddress}
        size="small"
        variant="contained"
        onClick={() => setOpen(true)}
        blocked={creatorWallet === walletAddress}>
        Schedule meeting
      </StatusButton>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            overflowY: 'auto',
          }}>
          <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2}}>
            <Typography variant="h5" component="h2" color="niftgen.black">
              Schedule meeting
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <ClearOutlinedIcon />
            </IconButton>
          </Box>
          {calLink ? (
            <Cal
              calLink={calLink}
              config={{
                name: account.userName,
                email: account.email,
                notes: `Meeting with ${account.userName}`,
                theme: 'dark',
              }}
            />
          ) : null}
        </Box>
      </Modal>
    </>
  );
}

Calendar.propTypes = {
  creatorWallet: PropTypes.string,
};
