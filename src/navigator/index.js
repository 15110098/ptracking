import React from 'react';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import LoginContainer from '../containers/LoginContainer'
import MainContainer from '../containers/MainContainer'
import {
    createReduxBoundAddListener,
    createReactNavigationReduxMiddleware,
  } from 'react-navigation-redux-helpers';
  
export const AppNavigator = StackNavigator({
  Login: { screen: LoginContainer },
  Main: { screen: MainContainer }
}, {
  initialRouteName: 'Login',
  headerMode :'none'
});
  


const AppWithNavigationState = ({ dispatch, nav }) => 
{
    const addListener = createReduxBoundAddListener("root");
    return (
  <AppNavigator
    navigation={addNavigationHelpers({ dispatch, state: nav, addListener })}
  />
)};

const mapStateToProps = state => ({
  nav: state.nav,
});
  
export default connect(mapStateToProps)(AppWithNavigationState);