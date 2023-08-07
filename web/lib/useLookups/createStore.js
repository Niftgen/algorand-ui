import {createStore} from '@niftgen/useStore';

export const UPDATE = 'lookups update';

const initialState = {
  interests: [],
  types: [],
  saleTypes: [],
};

const {useStore, StoreProvider} = createStore({
  actions: {
    [UPDATE]: (state, {lookups = []}) => ({
      ...state,
      interests: lookups.filter(({type}) => type === 'Categories'),
      types: lookups.filter(({type}) => type === 'UserTypes'),
      saleTypes: lookups.filter(({type}) => type === 'SaleTypes'),
    }),
  },
  initialState,
  name: 'Lookups',
});

export const useLookupsStore = useStore;
export const LookupsProvider = StoreProvider;
