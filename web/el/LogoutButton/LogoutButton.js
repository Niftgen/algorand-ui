import Button from '@mui/material/Button';
import {useAuth} from '@niftgen/useAuth';

export function LogoutButton(props) {
  const {token, walletAddress, logout} = useAuth();

  return token || walletAddress ? (
    <Button onClick={logout} sx={{fontSize: 16}} {...props}>
      Logout
    </Button>
  ) : null;
}
