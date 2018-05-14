import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';
import logger from 'redux-logger'
import {
    createReduxBoundAddListener,
    createReactNavigationReduxMiddleware,
  } from 'react-navigation-redux-helpers';

const navMiddleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
  );
  const addListener = createReduxBoundAddListener("root");
const middlewares = [navMiddleware,thunk ]
const enhancers = [
    applyMiddleware(...middlewares),
    // other store enhancers if any
  ]

const store = createStore(reducers,...enhancers)

export default store;