import {unstable_ClassNameGenerator as ClassNameGenerator} from '@mui/material/className';
import CssBaseline from '@mui/material/CssBaseline';
import {Experimental_CssVarsProvider as CssVarsProvider} from '@mui/material/styles';
import {AccountProvider, onUpdate as onUpdateAccount} from '@niftgen/useAccount';
import {AuthProvider} from '@niftgen/useAuth';
import {ConfigProvider} from '@niftgen/useConfig';
import {LookupsProvider} from '@niftgen/useLookups';
import {NftCommentsProvider} from '@niftgen/useNftComments';
import {NotificationsProvider} from '@niftgen/useNotifications';
import {UserPrivateMessagesProvider} from '@niftgen/useUserPrivateMessages';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import PropTypes from 'prop-types';
import {useMemo} from 'react';
import {App} from '../App/index';
import {theme} from './theme';

export function ProvidedApp({config, account, auth}) {
  ClassNameGenerator.configure(componentName => componentName);
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 300_000,
            refetchInterval: 600_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
    []
  );

  return (
    <ConfigProvider init={state => ({...state, ...config})}>
      <AuthProvider init={state => ({...state, ...auth})}>
        <AccountProvider init={state => onUpdateAccount(state, account)}>
          <LookupsProvider>
            <NftCommentsProvider>
              <UserPrivateMessagesProvider>
                <NotificationsProvider>
                  <QueryClientProvider client={queryClient}>
                    <CssVarsProvider defaultMode="dark" theme={theme}>
                      <CssBaseline />
                      <App />
                      <ReactQueryDevtools />
                    </CssVarsProvider>
                  </QueryClientProvider>
                </NotificationsProvider>
              </UserPrivateMessagesProvider>
            </NftCommentsProvider>
          </LookupsProvider>
        </AccountProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

ProvidedApp.propTypes = {
  config: PropTypes.shape({
    region: PropTypes.string.isRequired,
    api: PropTypes.string.isRequired,
    apikey: PropTypes.string.isRequired,
  }).isRequired,
  auth: PropTypes.shape({
    token: PropTypes.string,
    provider: PropTypes.string,
    walletAddress: PropTypes.string,
  }).isRequired,
  account: PropTypes.object,
};
