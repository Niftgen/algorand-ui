import {useConfigStore} from './createStore';

export const useConfig = () => {
  const {state} = useConfigStore();

  return state;
};
