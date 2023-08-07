import {compileFragments} from '@niftgen/compileFragments';
import {transactionFragment} from '@niftgen/fragments.transaction';
import fragment from './asset.fragment.graphql';

export const assetFragment = compileFragments(transactionFragment, fragment);
