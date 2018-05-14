import React, { Component } from 'react';
import {Text, View} from 'react-native';
import { TabNavigator,TabBarBottom  } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapViewScreen from './mapview';
import MessagerScreen from './messager';
import SettingScreen from './setting';
  
  const Main = TabNavigator({
    MapView: { screen: MapViewScreen },
    Messager: { screen: MessagerScreen },
    Setting: {screen: SettingScreen}
  },{
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'MapView') {
          iconName = `ios-locate${focused ? '' : '-outline'}`;
        } else if (routeName === 'Messager') {
          iconName = `ios-chatbubbles${focused ? '' : '-outline'}`;
        } else if (routeName ==='Setting') {
          iconName = `ios-settings${focused ? '' : '-outline'}`;
        }
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    lazy :true,
    tabBarOptions: {
      activeTintColor: '#e73b4b',
      inactiveTintColor: 'gray',
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: false,
    title:'hi'
  });

  export default Main