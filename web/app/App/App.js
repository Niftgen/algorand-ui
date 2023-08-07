import AppLayout from '@niftgen/AppLayout';
import {Loader} from '@niftgen/Loader';
import {safeLazy} from '@niftgen/safeLazy';
import {useAuth} from '@niftgen/useAuth';
import {useLookupsFetcher} from '@niftgen/useLookups';
import {useNotificationsFetcher, useNotificationsSubscription} from '@niftgen/useNotifications';
import {useAdd, useValue} from '@nkbt/react-router';
import {Suspense, useEffect} from 'react';
import {Admin, AdminOnly} from './Admin';
import {AuthorisedOnly} from './AuthorisedOnly';
import './theme.css';

const Home = safeLazy(() => import(/* webpackChunkName: "home" */ './Home'));
const Support = safeLazy(() => import(/* webpackChunkName: "support" */ './Support'));
const Browse = safeLazy(() => import(/* webpackChunkName: "browse" */ './Browse'));
const ChannelVideo = safeLazy(() => import(/* webpackChunkName: "video" */ './ChannelVideo'));
const Profile = safeLazy(() => import(/* webpackChunkName: "profile" */ './Profile'));
const User = safeLazy(() => import(/* webpackChunkName: "user" */ './User'));
const Creator = safeLazy(() => import(/* webpackChunkName: "creator" */ './Creator'));

export function App() {
  const {walletAddress} = useAuth();

  useLookupsFetcher();
  useNotificationsFetcher({walletAddress});
  useNotificationsSubscription();

  const setDefaults = useAdd();
  useEffect(() => {
    setDefaults({page: 'home'});
  }, [setDefaults]);

  const page = useValue('page');

  switch (page) {
    case 'support': {
      return (
        <AppLayout>
          <Suspense fallback={<Loader />}>
            <Support />
          </Suspense>
        </AppLayout>
      );
    }

    case 'video': {
      return (
        <AuthorisedOnly>
          <AppLayout>
            <Suspense fallback={<Loader />}>
              <ChannelVideo />
            </Suspense>
          </AppLayout>
        </AuthorisedOnly>
      );
    }

    case 'profile': {
      return (
        <AuthorisedOnly>
          <Suspense fallback={<Loader />}>
            <Profile />
          </Suspense>
        </AuthorisedOnly>
      );
    }

    case 'user': {
      return (
        <AuthorisedOnly>
          <AppLayout>
            <Suspense fallback={<Loader />}>
              <User />
            </Suspense>
          </AppLayout>
        </AuthorisedOnly>
      );
    }

    case 'videos':
    case 'browse': {
      return (
        <AuthorisedOnly>
          <AppLayout>
            <Suspense fallback={<Loader />}>
              <Browse />
            </Suspense>
          </AppLayout>
        </AuthorisedOnly>
      );
    }

    case 'creator': {
      return (
        <AuthorisedOnly>
          <Suspense fallback={<Loader />}>
            <Creator />
          </Suspense>
        </AuthorisedOnly>
      );
    }

    case 'admin': {
      return (
        <Suspense fallback={<Loader />}>
          <AuthorisedOnly>
            <AdminOnly>
              <Admin />
            </AdminOnly>
          </AuthorisedOnly>
        </Suspense>
      );
    }

    case 'home':
    default: {
      return (
        <AppLayout>
          <Suspense fallback={<Loader />}>
            <Home />
          </Suspense>
        </AppLayout>
      );
    }
  }
}
