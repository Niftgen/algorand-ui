import {Loader} from '@niftgen/Loader';
import {safeLazy} from '@niftgen/safeLazy';
import {Suspense} from 'react';

const Magic = safeLazy(() => import(/* webpackChunkName: "magic" */ './Magic'));

export function MagicLoader() {
  return (
    <Suspense fallback={<Loader />}>
      <Magic />
    </Suspense>
  );
}
