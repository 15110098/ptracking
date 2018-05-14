
import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';
import {Provider} from 'react-redux';
import store from './store'
import AppWithNavigationState from './navigator';

export default class App extends Component{
  render() {
    return (
      <Provider store = {store}>
      <AppWithNavigationState/>
      </Provider>
    );
  }
}
