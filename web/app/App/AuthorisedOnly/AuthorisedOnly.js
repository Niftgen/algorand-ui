import {Loader} from '@niftgen/Loader';
import {safeLazy} from '@niftgen/safeLazy';
import StandaloneFormLayout from '@niftgen/StandaloneFormLayout';
import {useAccount} from '@niftgen/useAccount';
import {useAuth} from '@niftgen/useAuth';
import PropTypes from 'prop-types';
import {Children, Suspense} from 'react';

const LoginPage = safeLazy(() => import(/* webpackChunkName: "auth" */ '../LoginPage'));
const SignupPage = safeLazy(() => import(/* webpackChunkName: "auth" */ '../SignupPage'));

export function AuthorisedOnly({children}) {
  const {token} = useAuth();
  const {account} = useAccount();

  if (!token) {
    // console.log('User not yet authorised');
    return (
      <StandaloneFormLayout>
        <Suspense fallback={<Loader />}>
          <LoginPage />
        </Suspense>
      </StandaloneFormLayout>
    );
  }

  if (account.id <= 0) {
    // console.log('User was fetched but is not yet registered');
    return (
      <StandaloneFormLayout>
        <Suspense fallback={<Loader />}>
          <SignupPage />
        </Suspense>
      </StandaloneFormLayout>
    );
  }

  return Children.only(children);
}

AuthorisedOnly.propTypes = {
  children: PropTypes.node.isRequired,
};
