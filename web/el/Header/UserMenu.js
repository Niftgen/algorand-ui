import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import {useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useAccount} from '@niftgen/useAccount';
import {getOptinApp, useAlgoAccount, useKyc} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import {useIpfs} from '@niftgen/useIpfs';
import {useNavigate} from '@nkbt/react-router';
import {useCallback, useState} from 'react';
import {Blank} from './Blank';

export function UserMenu() {
  const {walletAddress, logout} = useAuth();
  const {
    data: {kyc},
  } = useKyc(walletAddress);
  const {account} = useAccount();

  const navigate = useNavigate();

  const [anchor, setAnchor] = useState(null);
  const handleMenuToggle = useCallback(({currentTarget}) => setAnchor(e => (e === null ? currentTarget : null)), []);
  const handleClose = useCallback(() => setAnchor(null), []);

  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.up('sm'), {noSsr: true});

  const {ADMIN_ID} = useConfig();
  const adminAlgoAccount = useAlgoAccount(walletAddress);
  const adminModuleState = getOptinApp({account: adminAlgoAccount.data, appId: ADMIN_ID});
  const isAdmin = adminModuleState?.ROLE === 1;

  const {gateway} = useIpfs();
  return (
    <>
      <Box sx={{display: 'flex', alignItems: 'center'}}>
        <Stack direction="row" alignItems="center" onClick={handleMenuToggle} sx={{cursor: 'pointer'}}>
          {account.avatarPath ? (
            <Avatar alt="Avatar" src={gateway(account.avatarPath)} sx={{width: '2em', height: '2em'}} />
          ) : (
            <Blank width="2em" height="2em" color="#475CF6" />
          )}
          {sm ? <Typography sx={{pl: 1, textDecoration: 'underline'}}>{account.userName}</Typography> : null}
        </Stack>
      </Box>
      <Menu anchorEl={anchor} keepMounted open={Boolean(anchor)} onClose={handleClose} onClick={() => setAnchor(null)}>
        <MenuItem onClick={() => navigator.clipboard.writeText(walletAddress)}>
          Copy wallet address <ContentCopyOutlinedIcon sx={{ml: 1}} />
        </MenuItem>
        <Divider />
        {isAdmin ? <MenuItem onClick={() => navigate({page: 'admin'})}>Admin area</MenuItem> : null}
        {kyc ? (
          <MenuItem onClick={() => navigate({page: 'creator', creator: 'dashboard'})}>Creator dashboard</MenuItem>
        ) : null}
        <MenuItem onClick={() => navigate({page: 'user', user: walletAddress})}>Your profile</MenuItem>
        <MenuItem onClick={() => navigate({page: 'profile', profile: 'edit-profile'})}>Account details</MenuItem>
        <MenuItem onClick={() => navigate({page: 'creator', creator: 'comments'})}>Comments</MenuItem>
        <MenuItem onClick={() => navigate({page: 'profile', profile: 'messages'})}>Messages</MenuItem>
        <MenuItem onClick={() => navigate({page: 'profile', profile: 'claim-rewards'})}>Claim rewards</MenuItem>
        {!kyc ? <Divider /> : null}
        {!kyc ? (
          <MenuItem onClick={() => navigate({page: 'creator', creator: 'apply'})}>Apply to be a creator</MenuItem>
        ) : null}
        <Divider />
        <MenuItem onClick={() => logout()}>Logout</MenuItem>
      </Menu>
    </>
  );
}
