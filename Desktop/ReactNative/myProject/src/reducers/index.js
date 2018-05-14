import {combineReducers} from 'redux';
import navReducer from './navReducer';
import languageReducer from './languageReducer';

export default combineReducers({
  nav:navReducer,
  language:languageReducer
});