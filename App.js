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

const switchNavigator = createSwitchNavigator({
  // Login flow Navigation
  loginNav: createStackNavigator({
    Signin: SigninScreen,
    Signup: SignupScreen
  }),
  homeNav: createStackNavigator({
    Home: HomeScreen
  })
})
const App = createAppContainer(switchNavigator)

export default () => {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data()
            setLoading(false)
            setUser(userData)
            navigate('Home', {user})
          })
          .catch((error) => {
            setLoading(false)
          });
      } else {
        setLoading(false)
      }
    });
  }, []);

  return (
      <App ref={navigator => { setNavigator(navigator)}} />
  );
}
