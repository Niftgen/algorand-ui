import {createStore} from '@niftgen/useStore';

export const UPDATE = 'config update';

const initialState = {
  env: '',
  version: '',
  www: '',
  api: '',
  apikey: '',
  txn: '',
  ipfs: '',
  region: '',
};

function onUpdate(state, {config}) {
  return {...state, ...config};
}

const {useStore, StoreProvider} = createStore({
  actions: {
    [UPDATE]: onUpdate,
  },
  initialState,
  name: 'Config',
});

export const useConfigStore = useStore;
export const ConfigProvider = StoreProvider;
