import {compileFragments} from '@niftgen/compileFragments';
import {userFragment} from '@niftgen/fragments.user';
import fragment from './comment.fragment.graphql';

export const commentFragment = compileFragments(userFragment, fragment);
