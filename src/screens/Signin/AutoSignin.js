import React, { useEffect, useState } from 'react';
import { firebase } from '../../firebase/config';
import { navigate } from '../../navigationRef';

export default AutoSignin = () => {

    useEffect(() => {
        const usersRef = firebase.firestore().collection('users');
        firebase.auth().onAuthStateChanged(user => {
        if (user) {
            usersRef
            .doc(user.uid)
            .get()
            .then((document) => {
                const userData = document.data()
                navigate('Home', {userData})
            })
            .catch((error) => {
                console.log('====================================');
                console.log(error);
                console.log('====================================');
                navigate('Signin')
            });
        } else {
            navigate('Signin')
        }
        });
    }, []);

    return null;
}