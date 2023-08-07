import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import {useAccount} from '@niftgen/useAccount';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import {useIpfs} from '@niftgen/useIpfs';
import {useCallback, useRef, useState} from 'react';

export function importJitsiApi() {
  return new Promise(resolve => {
    if (window.JitsiMeetExternalAPI) {
      resolve(window.JitsiMeetExternalAPI);
    } else {
      const head = document.querySelector('head');
      const script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', 'https://meet.jit.si/external_api.js');
      script.addEventListener('load', () => resolve(window.JitsiMeetExternalAPI), true);
      head.appendChild(script);
    }
  });
}

async function fetchRoom({txn, token, creatorAddress}) {
  const res = await window.fetch(`${txn}/room`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({creatorAddress}),
  });
  if (res.status !== 200) {
    throw new Error(`Cannot generate room: ${await res.text()}`);
  }
  return await res.json();
}

export function JitsiRoom() {
  const {account} = useAccount();
  const {gateway} = useIpfs();
  const avatarPath = gateway(account.avatarPath);
  const apiRef = useRef(null);
  const {txn} = useConfig();
  const {token, walletAddress} = useAuth();

  const [jitsiInProgress, setJitsiInProgress] = useState(false);

  const startMeeting = useCallback(
    async e => {
      e.preventDefault();
      if (jitsiInProgress) {
        return;
      }

      setJitsiInProgress(true);
      const [JitsiMeetExternalAPI, {roomId}] = await Promise.all([
        importJitsiApi(),
        fetchRoom({txn, token, creatorAddress: walletAddress}),
      ]);

      apiRef.current = new JitsiMeetExternalAPI('meet.jit.si', {
        roomName: roomId,
        parentNode: document.querySelector('#jitsi-container'),
        userInfo: {
          displayName: account.userName,
          email: account.email,
        },
        interfaceConfigOverwrite: {
          APP_NAME: 'Niftgen',
          TOOLBAR_BUTTONS: ['microphone', 'camera', 'chat', 'raisehand', 'tileview', 'fullscreen'],
          DEFAULT_BACKGROUND: '#18171c',
          GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
          HIDE_INVITE_MORE_HEADER: true,
          MOBILE_APP_PROMO: false,
          OPTIMAL_BROWSERS: ['chrome', 'chromium', 'firefox', 'nwjs', 'electron', 'safari', 'opera', 'edge'],
          RECENT_LIST_ENABLED: false,
          SHOW_JITSI_WATERMARK: false,
          DEFAULT_REMOTE_DISPLAY_NAME: 'Remote Participant',
        },
        configOverwrite: {
          securityUi: {
            hideLobbyButton: true,
            disableLobbyPassword: true,
          },
          whiteboard: {
            enabled: false,
          },
          disablePolls: true,

          welcomePage: {
            disabled: true,
          },
          lobby: {
            autoKnock: false,
            enableChat: false,
          },
          disableProfile: false,

          requireDisplayName: true,
          prejoinConfig: {
            enabled: false,
            hideDisplayName: true,
            hideExtraJoinButtons: ['no-audio', 'by-phone'],
          },
          analytics: {
            // True if the analytics should be disabled
            disabled: true,
          },
          apiLogLevels: ['error'],

          // Disables all invite functions from the app (share, invite, dial out...etc)
          disableInviteFunctions: true,

          // Disables storing the room name to the recents list. When in an iframe this is ignored and
          // the room is never stored in the recents list.
          doNotStoreRoom: true,

          // Sets the conference subject
          subject: `Meeting with ${account.userName}`,

          // Sets the conference local subject (for room creator)
          localSubject: `Meeting with ${account.userName}`,
        },
      });

      apiRef.current.executeCommand('avatarUrl', avatarPath);
      apiRef.current.executeCommand('email', account.email);
      apiRef.current.executeCommand('displayName', account.userName);
    },
    [account.email, account.userName, avatarPath, jitsiInProgress, token, txn, walletAddress]
  );

  const endMeeting = useCallback(e => {
    e.preventDefault();
    setJitsiInProgress(false);
    if (apiRef.current) {
      apiRef.current.dispose();
      apiRef.current = null;
    }
  }, []);

  return (
    <>
      <Button variant="contained" onClick={startMeeting}>
        Start Jitsi Room
      </Button>

      <Modal open={jitsiInProgress} onClose={endMeeting} keepMounted>
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
          }}>
          <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2}}>
            <Typography variant="h5" component="h2" color="niftgen.black">
              Video chat
            </Typography>
            <IconButton onClick={endMeeting}>
              <ClearOutlinedIcon />
            </IconButton>
          </Box>
          <div id="jitsi-container" style={{width: '100%', height: 600}} />
        </Box>
      </Modal>
    </>
  );
}
