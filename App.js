import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SigninScreen from './src/screens/Signin/SigninScreen';
import SignupScreen from './src/screens/Signup/SignupScreen';
import { setNavigator } from './src/navigationRef';
import HomeScreen from './src/screens/Home/HomeScreen';
import { firebase } from './src/firebase/config';
import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import AutoSignin from './src/screens/Signin/AutoSignin';
console.disableYellowBox = true;

const switchNavigator = createSwitchNavigator({
  autoSignin: AutoSignin,
  loginNav: createStackNavigator({ // Login flow Navigation
    Signin: {
      screen: SigninScreen
    },
    Signup: {
      screen: SignupScreen
    }
  }),
  homeNav: createStackNavigator({ // Post-login flow Navigation
    Home: {
      screen: HomeScreen
    }
  })
})
const App = createAppContainer(switchNavigator)

export default () => {
  return (
      <App ref={navigator => { setNavigator(navigator)}} />
  );
}
