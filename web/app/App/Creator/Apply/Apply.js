import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {AdminModuleOptinButton} from '@niftgen/AdminModuleOptinButton';
import {ExternalLink} from '@niftgen/ExternalLink';
import {SubscriptionAppDeployButton} from '@niftgen/SubscriptionAppDeployButton';
import {SubscriptionModuleOptinButton} from '@niftgen/SubscriptionModuleOptinButton';
import {useKyc} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';

export function Apply() {
  const {walletAddress} = useAuth();

  const {
    data: {kyc},
  } = useKyc(walletAddress);

  return (
    <Stack spacing={3}>
      {kyc ? (
        <Alert variant="outlined" severity="success">
          Your application is accepted
        </Alert>
      ) : null}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        onClick={() => navigator.clipboard.writeText(walletAddress)}
        sx={{cursor: 'pointer'}}>
        <TextField
          disabled
          fullWidth
          name="walletAddress"
          label="Wallet Address"
          type="text"
          id="walletAddress"
          value={walletAddress}
        />
        <ContentCopyOutlinedIcon sx={{ml: 1}} />
      </Stack>

      <Typography>
        You need to send us your wallet address to{' '}
        <ExternalLink href="mailto:christian.c@niftgen.com">e-mail</ExternalLink>
      </Typography>

      <Typography>
        <b>Step 1</b> - The first step is to click "upgrade your account to creator". That will start the process.
      </Typography>

      <Box>
        <AdminModuleOptinButton>Request upgrade your account to creator</AdminModuleOptinButton>
      </Box>

      <Typography>
        <b>Step 2</b> - Then you need to contact us via any way bellow and be sure to include any existing content,
        social channels, and brief bio. We will review all information and contact you for next steps.
      </Typography>

      <Typography component="div">
        <ul>
          <li>
            <ExternalLink href="https://discord.gg/hzSG4VFCYJ">Join Discord Server</ExternalLink> and send direct
            message to <b>Chris.Casini#8129</b>
          </li>
          <li>
            Send Message on our <ExternalLink href="https://twitter.com/niftgen">Twitter Channel</ExternalLink>
          </li>
          <li>
            Send us a message on Telegram:{' '}
            <ExternalLink href="https://t.me/christianniftgen">@christianniftgen</ExternalLink>
          </li>
          <li>
            Send us an <ExternalLink href="mailto:christian.c@niftgen.com">e-mail</ExternalLink>
          </li>
        </ul>
      </Typography>

      <Typography>
        <b>Step 3</b> - Once you have been approved, you will be able to complete the following actions:
      </Typography>

      <Box>
        <SubscriptionModuleOptinButton>1. Enable subscription</SubscriptionModuleOptinButton>
      </Box>

      <Box>
        <SubscriptionAppDeployButton>2. Confirm upgrade</SubscriptionAppDeployButton>
      </Box>
    </Stack>
  );
}
