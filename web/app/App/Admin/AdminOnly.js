import {Loader} from '@niftgen/Loader';
import {getOptinApp, useAlgoAccount} from '@niftgen/useAlgod';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import PropTypes from 'prop-types';
import {Children} from 'react';
import {Layout} from './Layout';

export function AdminOnly({children}) {
  const {ADMIN_ID} = useConfig();
  const {walletAddress} = useAuth();
  const adminAlgoAccount = useAlgoAccount(walletAddress);
  const adminModuleState = getOptinApp({account: adminAlgoAccount.data, appId: ADMIN_ID});

  if (adminAlgoAccount.isLoading) {
    return <Loader />;
  }

  if (adminModuleState?.ROLE !== 1) {
    return <Layout Header="403 Access denied" />;
  }

  return Children.only(children);
}

AdminOnly.propTypes = {
  children: PropTypes.node.isRequired,
};
