import React, { useState } from 'react'
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { navigate } from '../../navigationRef';
import { firebase } from '../../firebase/config'
import { PLACEHOLDER_TEXT_COLOR } from '../../config/constant';
import Loader from '../../components/LoaderComponent';
import logo from '../../../assets/logo.jpeg';

export default SignupScreen = () => {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loader, setLoader] = useState(false)

    /**
     * Method to navigate to Signin screen
     */
    const onSigninLinkPress = () => {
        navigate('Signin')
    }

    /**
     * Method to validate E-mail
     */
    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    /**
     * Method to validate the inputs
     */
    const onRegisterPress = () => {
        if (fullName.trim() == "" || email.trim() == "" || password.trim() == "" || confirmPassword.trim() == "") {
            showAlert("Enter all the fields")
        } else if (!validateEmail(email)) {
            showAlert("Enter valid E-mail")
        } else if (password !== confirmPassword) {
            showAlert("Passwords don't match")
        } else {
            doRegister(); // Call the register process
        }
    }

    /**
     * Method to show the alert
     */
    const showAlert = async (message) => {
        await Alert.alert(
            'Alert',
            message,
            [
                { text: 'OK' },
            ],
            { cancelable: true }
        )
    }

    /**
     * Method to do the Registration process
     */
    const doRegister = async () => {
        setLoader(true)
        try {
            await firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then((response) => {
                    const uid = response.user.uid
                    const data = {
                        id: uid,
                        email,
                        fullName,
                    };
                    // Store it into Firestore
                    const usersRef = firebase.firestore().collection('users')
                    usersRef
                        .doc(uid)
                        .set(data)
                        .then((resp) => {
                            navigate('Home', {userData: data})
                        })
                        .catch((error) => {
                            alert(error)
                        });
                })
                .catch((error) => {
                    alert(error)
            });
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
                style={{ flex: 1, width: '100%' }}>
                <Image
                    style={styles.logo}
                    source={logo}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Full Name'
                    placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                    onChangeText={(text) => setFullName(text)}
                    value={fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    ref={ref => _nameInput = ref}
                    returnKeyType="next"
                    onSubmitEditing={() => { _emailInput && _emailInput.focus() }}
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
                    blurOnSubmit={false}
                    ref={ref => _passwordInput = ref}
                    returnKeyType="next"
                    onSubmitEditing={() => { _confirmPasswordInput && _confirmPasswordInput.focus() }}
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                    secureTextEntry
                    placeholder='Confirm Password'
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    blurOnSubmit={true}
                    ref={ref => _confirmPasswordInput = ref}
                    returnKeyType="done"
                    onSubmitEditing={onRegisterPress}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onRegisterPress()}>
                    <Text style={styles.buttonTitle}>Create account</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Already got an account? <Text onPress={onSigninLinkPress} style={styles.footerLink}>Log in</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}