import {safeImport} from '@niftgen/safeImport';

safeImport(() => import(/* webpackChunkName: "app" */ './app')).then(({app}) => app());

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => {
    // do nothing
  });
}
