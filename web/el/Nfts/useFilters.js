import {useNavigate, useValue} from '@nkbt/react-router';
import {useCallback} from 'react';

export function useFilters() {
  const navigate = useNavigate();

  const categoryParam = useValue('category');
  const category = `${categoryParam}`.split('~').map(Number).filter(Boolean);
  const onCategoryChange = useCallback(event => navigate({category: event.target.value.sort().join('~')}), [navigate]);

  const sort = useValue('sort') || 'createdAt';
  const onSortChange = useCallback(event => navigate({sort: event.target.value}), [navigate]);

  const kind = useValue('kind') || 'subs';
  const onKindChange = useCallback(event => navigate({kind: event.target.value}), [navigate]);

  return {
    category,
    onCategoryChange,
    sort,
    onSortChange,
    kind,
    onKindChange,
  };
}
