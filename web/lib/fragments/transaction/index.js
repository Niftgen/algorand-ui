import {compileFragments} from '@niftgen/compileFragments';
import {userFragment} from '@niftgen/fragments.user';
import fragment from './transaction.fragment.graphql';

export const transactionFragment = compileFragments(userFragment, fragment);
