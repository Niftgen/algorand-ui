import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import {StatusButton} from '@niftgen/StatusButton';
import {useAccount} from '@niftgen/useAccount';
import {getSubscriptionAppStateById, getSubscriptionModuleState, useAlgoAccount} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import {useIpfs} from '@niftgen/useIpfs';
import {useQuery} from '@tanstack/react-query';
import PropTypes from 'prop-types';
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

async function fetchRoom({txn, token, creatorWallet}) {
  const res = await window.fetch(`${txn}/room`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({creatorAddress: creatorWallet}),
  });
  if (res.status !== 200) {
    throw new Error(`Cannot generate room: ${await res.text()}`);
  }
  return await res.json();
}

function useRoom({creatorWallet}) {
  const {txn, SUBSCRIPTION_MODULE_ID} = useConfig();
  const {walletAddress} = useAuth();
  const creatorAlgoAccount = useAlgoAccount(creatorWallet);
  const userAlgoAccount = useAlgoAccount(walletAddress);
  const subscriptionModuleState = getSubscriptionModuleState(SUBSCRIPTION_MODULE_ID, creatorAlgoAccount.data);
  const subscriptionAppState = getSubscriptionAppStateById(
    subscriptionModuleState.subscriptionAppId,
    userAlgoAccount.data
  );
  const {token} = useAuth();

  return useQuery({
    queryKey: ['room', creatorWallet],
    queryFn: async () => {
      const {roomId} = await fetchRoom({txn, token, creatorWallet});
      if (!roomId) {
        throw new Error('Creator room not found');
      }
      return roomId;
    },
    enabled: Boolean(
      txn &&
        token &&
        creatorWallet &&
        walletAddress !== creatorWallet &&
        subscriptionAppState.subscribed &&
        subscriptionAppState.activeSubscription
    ),
    refetchInterval: 30_000,
    refetchType: 'active',
  });
}

export function JitsiConnect({creatorWallet}) {
  const {data: roomId} = useRoom({creatorWallet});
  const {account} = useAccount();
  const {gateway} = useIpfs();
  const avatarPath = gateway(account.avatarPath);

  const apiRef = useRef(null);

  const [jitsiInProgress, setJitsiInProgress] = useState(false);

  const startMeeting = useCallback(
    async e => {
      e.preventDefault();
      if (jitsiInProgress) {
        return;
      }
      if (!roomId) {
        return;
      }
      setJitsiInProgress(true);

      const JitsiMeetExternalAPI = await importJitsiApi();
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
        },
      });

      apiRef.current.executeCommand('avatarUrl', avatarPath);
      apiRef.current.executeCommand('email', account.email);
      apiRef.current.executeCommand('displayName', account.userName);
    },
    [account.email, account.userName, avatarPath, jitsiInProgress, roomId]
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
      <StatusButton size="small" variant="contained" onClick={startMeeting} disabled={!roomId}>
        Video chat
      </StatusButton>

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

JitsiConnect.propTypes = {
  creatorWallet: PropTypes.string,
};
