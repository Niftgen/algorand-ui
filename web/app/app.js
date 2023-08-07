import {Loader} from '@niftgen/Loader';
import {parseConfig} from '@niftgen/useConfig';
import {Router, useLocationSync} from '@nkbt/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './favicon.svg';
import {prepareAuth} from './prepareAuth';
import {ProvidedApp} from './ProvidedApp';

import './robots.txt';

export async function app() {
  const config = parseConfig();
  const {account, auth} = await prepareAuth(config);

  function WithLocation(props) {
    useLocationSync();

    return <ProvidedApp {...props} />;
  }

  const app = document.querySelector('#app');
  const root = ReactDOM.createRoot(app);
  root.render(
    <React.StrictMode>
      <React.Suspense fallback={<Loader />}>
        <Router search={document.location.search} params={{page: 'home'}}>
          <WithLocation {...{config, account, auth}} />
        </Router>
      </React.Suspense>
    </React.StrictMode>
  );
}
