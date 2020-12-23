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

// const Stack = createStackNavigator();
const switchNavigator = createSwitchNavigator({
  // autoSignin: AutoSignin,
  loginNav: createStackNavigator({ // Login flow Navigation
    Signin: {
      screen: SigninScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    Signup: {
      screen: SignupScreen,
      navigationOptions: {
        headerShown: false
      }
    }
  }),
  homeNav: createStackNavigator({ // Post-login flow Navigation
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        headerShown: false
      }
    }
  })
})
const App = createAppContainer(switchNavigator)

export default () => {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  // useEffect(() => {
  //   const usersRef = firebase.firestore().collection('users');
  //   firebase.auth().onAuthStateChanged(user => {
  //     if (user) {
  //       usersRef
  //         .doc(user.uid)
  //         .get()
  //         .then((document) => {
  //           const userData = document.data()
  //           setUser(user)
  //           setLoading(false)
  //           // navigate('Home', {user})
  //         })
  //         .catch((error) => {
  //           setLoading(false)
  //         });
  //     } else {
  //       setLoading(false)
  //     }
  //   });
  // }, []);

  return (
      <App ref={navigator => { setNavigator(navigator)}} />
    // <NavigationContainer>
    //   <Stack.Navigator>
    //     { user ? (
    //       <>
    //       <Stack.Screen name="Home">
    //         {props => <HomeScreen {...props} extraData={user} />}
    //       </Stack.Screen>
    //       <Stack.Screen name="Signin" component={SigninScreen} />
    //       <Stack.Screen name="Signup" component={SignupScreen} />
    //       </>
    //     ) : (
    //       <>
    //         <Stack.Screen name="Signin" component={SigninScreen} />
    //         <Stack.Screen name="Signup" component={SignupScreen} />
    //       </>
    //     )}
    //   </Stack.Navigator>
    // </NavigationContainer>
  );
}
