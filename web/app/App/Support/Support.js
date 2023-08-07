import {supportPages} from '@niftgen/wiki';
import {useAdd, useRemove, useValue} from '@nkbt/react-router';
import {useEffect} from 'react';
import {Layout} from './Layout';
import {Page} from './Page';

export function Support() {
  const support = useValue('support');
  const removeParams = useRemove();
  const addParams = useAdd();

  useEffect(() => {
    const defaultParams = {
      support: 'home',
    };
    addParams(defaultParams);
    return () => {
      if (process.env.NODE_ENV !== 'development') {
        removeParams({support: null});
      }
    };
  }, [removeParams, addParams]);

  return <Layout Header={supportPages[support]} Content={<Page name={support} />} />;
}
