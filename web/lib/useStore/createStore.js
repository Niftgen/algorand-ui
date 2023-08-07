import {shallowEqualObjects} from '@nkbt/shallow-equal-objects';
import PropTypes from 'prop-types';
import {createContext, useContext, useReducer} from 'react';

const IS_DEBUG = (() => {
  try {
    return process.env.NODE_ENV === 'development' || window.localStorage.DEBUG === 'true';
  } catch (err) {
    return false;
  }
})();

export function createStore({name, actions, initialState}) {
  const DispatchContext = createContext(() => {});
  const StateContext = createContext(initialState);

  function reducer(state, {type, ...payload}) {
    const action = {type, ...payload};
    const newState = action.type in actions ? actions[action.type](state, action) : state;
    if (IS_DEBUG) {
      // eslint-disable-next-line no-console
      // console.log(type, '\n', payload, '\n', newState);
    }
    return shallowEqualObjects(state, newState) ? state : newState;
  }

  function StoreProvider({children, init}) {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    return (
      <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>{children}</StateContext.Provider>
      </DispatchContext.Provider>
    );
  }

  StoreProvider.displayName = `${name}StoreProvider`;
  StoreProvider.propTypes = {
    init: PropTypes.func,
    children: PropTypes.node.isRequired,
  };
  StoreProvider.defaultProps = {
    init: undefined,
  };

  function useStore() {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);
    return {state, dispatch};
  }

  return {
    StoreProvider,
    useStore,
  };
}
