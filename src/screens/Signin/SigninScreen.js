import React, { useState } from 'react'
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { navigate } from '../../navigationRef';
import { firebase } from '../../firebase/config';
import Loader from '../../components/LoaderComponent';
import { PLACEHOLDER_TEXT_COLOR } from '../../config/constant';
import logo from '../../../assets/logo.jpeg';

export default SigninScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loader, setLoader] = useState(false)

    /**
     * Method to navigate to Signup screen
     */
    const onSignupLinkPress = () => {
        navigate('Signup')
    }

    /**
     * Method to validate E-mail
     */
    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    /**
     * Method to validate the credentials
     */
    const onLoginPress = async () => {
        if (email.trim() != "" && validateEmail(email) && password.trim() != "") {
            doLogin(); // Call the login process
        } else {
            await Alert.alert(
                'Alert',
                'Enter valid E-mail/Password',
                [
                    { text: 'OK' },
                ],
                { cancelable: true }
            )
        }
    }

    /**
     * Method to do the login process
     */
    const doLogin = async () => {
        setLoader(true)
        try {
            await firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then((response) => {
                    const uid = response.user.uid
                    const usersRef = firebase.firestore().collection('users')
                    usersRef
                        .doc(uid)
                        .get()
                        .then(firestoreDocument => {
                            if (!firestoreDocument.exists) {
                                alert("User does not exist anymore.")
                                return;
                            }
                            const userData = firestoreDocument.data()
                            navigate('Home', {userData})
                        })
                        .catch(error => {
                            alert(error)
                        });
                })
                .catch(error => {
                    alert(error)
                })
        } catch (error) {
            alert(error)
        } finally {
            setLoader(false)
        }
        
    }

    return (
        <View style={styles.container}>
            <Loader loading={loader} />
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={logo}
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    ref={ref => _emailInput = ref}
                    returnKeyType="next"
                    onSubmitEditing={() => { _passwordInput && _passwordInput.focus() }}
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    blurOnSubmit={true}
                    ref={ref => _passwordInput = ref}
                    returnKeyType="done"
                    onSubmitEditing={() => { onLoginPress }}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonTitle}>Log in</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Don't have an account? <Text onPress={onSignupLinkPress} style={styles.footerLink}>Sign up</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}