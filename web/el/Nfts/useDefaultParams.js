import {ALGO} from '@niftgen/currency';
import {useAdd, useNavigate, useRemove, useValue} from '@nkbt/react-router';
import {useCallback, useEffect} from 'react';

const limit = 90;

export function useDefaultParams() {
  const addParams = useAdd();
  const removeParams = useRemove();

  useEffect(() => {
    const defaultParams = {
      category: '',
      currency: ALGO,
      sort: 'createdAt',
      offset: '0',
    };
    addParams(defaultParams);
    return () => {
      if (process.env.NODE_ENV !== 'development') {
        removeParams(defaultParams);
      } else {
        removeParams({offset: '0'});
      }
    };
  }, [addParams, removeParams]);

  const offset = parseInt(useValue('offset') || 0);
  const navigate = useNavigate();
  const onNext = useCallback(_event => navigate({offset: offset + limit}), [navigate, offset]);
  const onPrev = useCallback(_event => navigate({offset: offset - limit}), [navigate, offset]);

  return {
    limit,
    offset,
    onNext,
    onPrev,
  };
}
