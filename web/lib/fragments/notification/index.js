import {compileFragments} from '@niftgen/compileFragments';
import {assetFragment} from '@niftgen/fragments.asset';
import {commentFragment} from '@niftgen/fragments.comment';
import {ratingFragment} from '@niftgen/fragments.rating';
import {transactionFragment} from '@niftgen/fragments.transaction';
import {userFragment} from '@niftgen/fragments.user';
import fragment from './notification.fragment.graphql';

export const notificationFragment = compileFragments(
  fragment,
  assetFragment,
  commentFragment,
  ratingFragment,
  userFragment,
  transactionFragment
);
