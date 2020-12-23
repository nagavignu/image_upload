import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { MIME_TYPE_LIST } from '../../config/constant';
import { Feather, AntDesign, FontAwesome, Entypo } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';
import moment from 'moment';
import { navigate } from '../../navigationRef';
import * as Sharing from 'expo-sharing';

export default HomeScreen = ({navigation}) => {

    const [isFileChosen, setIsFileChosen] = useState(false)
    const [fileName, setfileName] = useState(null)
    const [fileUri, setfileUri] = useState(null)
    const [fileSize, setFileSize] = useState(null)
    const [fileExt, setFileExt] = useState(null)
    const [fileList, setFileList] = useState([])
    const userId = navigation.state.params.userData.id ? navigation.state.params.userData.id : null
    const fileInfoRef = firebase.firestore().collection('fileInfo')

    useEffect(() => {
        getFileList(); // Fetch the uploaded file list
    }, [])

    /**
     * Method to Handle the Upload process
     */
    const onUploadPress = () => {
        firebase
            .storage()
            .ref(fileName)
            .put(fileUri)
            .then((resp) => {
                alert(`File has been uploaded successfully.`);
                getFileUrl();
            })
            .catch((e) => console.log(e));
    }

    /**
     * Method to get the uploaded URL
     */
    const getFileUrl = () => {
        let fileRef = firebase.storage().ref('/' + fileName);
        fileRef
            .getDownloadURL()
            .then((url) => {
                // Add the file info to the store
                addFileInfo(url)
            })
            .catch((e) => console.log('getting downloadURL of image error => ', e));
    }

    /**
     * Method to Add the uploaded file info in the store
    */
    const addFileInfo = (fileCloudUrl) => {
        const data = {
            userId: userId,
            fileName,
            fileUrl: fileCloudUrl,
            fileSize,
            fileExt,
            dateTime: new Date(),
            localUri: fileUri
        }
        fileInfoRef
            .add(data)
            .then(resp => {
                resetFileInfo(); // Reset the chosen file details after upload
            })
            .catch(error => {
                alert(error)
            });
    }

    /**
     * Method to Handle the Image/Document upload
     */
    const onBrowseFile = async () => {
        try {

            let isGranted = true;
            // Get the required permission
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                isGranted = false;
            }

            if (isGranted) {
                const result = await DocumentPicker.getDocumentAsync({})
                if (result.type === "success") {
                    if (!validateMimeType(result.uri.split(".").pop())) { // Mime type validation
                        alert("Please Choose a Document as specified format")
                    } else if (Math.round(result.size / 1024) > 2048) { // File size validation
                        alert("Please Choose a Document less than 2MB")
                    } else {
                        setIsFileChosen(true)
                        setfileName(result.name)
                        setfileUri(result.uri)
                        setFileSize(result.size)
                        setFileExt(result.uri.split(".").pop().toLowerCase())
                    }
                }
            } else {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        } catch (e) {
            console.log(e)
            alert("Something went wrong with the File")
        }
    }

    /**
     * Method to validate the MIME type
     */
    const validateMimeType = (selectedMimeType) => {
        let mimeResult = false;
        mimeResult = MIME_TYPE_LIST.filter(type => { 
            return type === selectedMimeType.toLowerCase() ? true : false
        })
        return (mimeResult.toString() !== "") ? true : false;
    }

    /**
     * Method to reset the Chosed file info after upload
     */
    const resetFileInfo = () => {
        setIsFileChosen(false)
        setfileName(null)
        setfileUri(null)
        setFileSize(null)
        setFileExt(null)
    }

    /**
     * Method to get the uploaded file list
     */
    const getFileList = () => {
        fileInfoRef
            .where("userId", "==", userId)
            .onSnapshot(
                querySnapshot => {
                    const files = []
                    querySnapshot.forEach(doc => {
                        const fileData = doc.data()
                        fileData.id = doc.id
                        files.push(fileData)
                    });
                    setFileList(files)
                },
                error => {
                    console.log(error)
                }
            )
    }

    /**
     * Method to delete the existing file
     */
    const onDeleteFile = async (id) => {
        Alert.alert(
            'Delete File',
            'Are you sure you want to Delete this file?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: async () => {
                    await fileInfoRef.doc(id).delete().then(resp => {
                        alert("File has been deleted successfully.");
                        getFileList();
                    });
                }},
            ],
            { cancelable: false }
        )
    }

    /**
     * Method to do the Logout press
     */
    const onLogoutPress = async () => {
        try {
            await firebase.auth().signOut();
            navigate("Signin");
        } catch (error) {
            alert(error)
        }
    }

    /**
     * Method to do the image sharing process
     */
    const onShareImage = async (rowItem) => {
        if (!(await Sharing.isAvailableAsync())) {
          alert(`Sharing is not available on your platform`);
          return;
        }
    
        await Sharing.shareAsync(rowItem.localUri);
    };


    /**
     * Method to generate the list item with swipe options
     */
    const SwipoutElement = ({rowItem, rowIndex}) => {

        let swipeBtns = [
            {
                component: (
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Entypo size={24} name='share' color="white" />
                    </View>
                ),
                backgroundColor: '#00ab62',
                underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                onPress: () => { onShareImage(rowItem) }
            },
            {
                component: (
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <AntDesign size={24} name='delete' color="white" />
                    </View>
                ),
                backgroundColor: '#f74455',
                underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                onPress: () => { onDeleteFile(rowItem.id)}
            }
        ];


        return (
            <Swipeout 
                right={swipeBtns}
                backgroundColor= 'transparent'>
                    <View style={styles.rowContainer}>
                        <View>
                            <FontAwesome size={24} name='image' color="black" />
                        </View>
                        <View>
                            <View>
                                <Text>{rowItem.fileName}</Text>
                            </View>
                            <View>
                                <Text>{rowItem.fileSize ? (rowItem.fileSize / (1024 * 1024)).toFixed(2)+" MB" : "0 KB"}</Text>
                                <Text>{ rowItem.dateTime+"---"+rowItem.dateTime ? moment(rowItem.dateTime).format("MMM DD, YYYY") : null }</Text>
                            </View>
                        </View>
                    </View>
            </Swipeout>
        )

    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onLogoutPress}>
                <Text>Logout</Text>
            </TouchableOpacity>
            <View style={styles.formContainer}>
                {/* <TouchableOpacity style={styles.browseBtn} onPress={ onBrowseFile }> */}
                    <TextInput
                        style={styles.input}
                        placeholder='Choose file name'
                        placeholderTextColor="#aaaaaa"
                        value={fileName}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                        editable={false}
                        onFocus={onBrowseFile}
                    />
                {/* </TouchableOpacity> */}
                <TouchableOpacity style={styles.button} onPress={ isFileChosen ? onUploadPress : onBrowseFile }>
                    <Text style={styles.buttonText}>{ "Upload" }</Text>
                </TouchableOpacity>
            </View>
            { fileList && (
                <View style={styles.listContainer}>
                    <FlatList
                        data={ fileList }
                        renderItem={({item, index}) => 
                            <SwipoutElement rowItem={item} rowIndex={index} />
                        } 
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
            )}
        </View>
    )
}