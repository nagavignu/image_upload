import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDjIqiY-o_DzRjrlN9NOSos27hRcjvCQ_w',
  authDomain: 'imageupload-5cb8b.firebaseapp.com',
  databaseURL: 'https://imageupload-5cb8b-default-rtdb.firebaseio.com/',
  projectId: 'imageupload-5cb8b',
  storageBucket: 'imageupload-5cb8b.appspot.com',
  messagingSenderId: '993959153580',
  appId: '1:993959153580:android:0123e4b186e8d470e53409',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };