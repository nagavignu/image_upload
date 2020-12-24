import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Image, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { MIME_TYPE_LIST } from '../../config/constant';
import { Feather, AntDesign, FontAwesome, Entypo, Ionicons } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';
import moment from 'moment';
import { navigate } from '../../navigationRef';
import * as Sharing from 'expo-sharing';
import Loader from '../../components/LoaderComponent';
import { Avatar, ListItem } from 'react-native-elements';


export default HomeScreen = ({navigation}) => {

    const [isFileChosen, setIsFileChosen] = useState(false)
    const [fileName, setfileName] = useState(null)
    const [fileUri, setfileUri] = useState(null)
    const [fileSize, setFileSize] = useState(null)
    const [fileExt, setFileExt] = useState(null)
    const [fileList, setFileList] = useState([])
    const [loader, setLoader] = useState(false)
    const userId = navigation.state.params.userData.id ? navigation.state.params.userData.id : null
    const fileInfoRef = firebase.firestore().collection('fileInfo')

    useEffect(() => {
        getFileList(); // Fetch the uploaded file list
    }, [])

    /**
     * Method to Handle the Upload process
     */
    const onUploadPress = async () => {
        setLoader(true)
        try {
            await firebase
                .storage()
                .ref(fileName)
                .put(fileUri)
                .then((resp) => {
                    showAlert(`File has been uploaded successfully.`);
                    getFileUrl();
                })
                .catch((e) => showAlert(e));
        } catch (error) {
            showAlert(error)
        } finally {
            setLoader(false)
        }
    }

    /**
     * Method to get the uploaded file URL
     */
    const getFileUrl = async () => {
        try {
            let fileRef = firebase.storage().ref('/' + fileName);
            await fileRef
                .getDownloadURL()
                .then((url) => {
                    // Add the file info to the store
                    addFileInfo(url)
                })
                .catch((e) => showAlert(e));
        } catch (error) {
            showAlert(error)
        }
    }

    /**
     * Method to Add the uploaded file info in the store
    */
    const addFileInfo = async (fileCloudUrl) => {
        try {
            const data = {
                userId: userId,
                fileName,
                fileUrl: fileCloudUrl,
                fileSize,
                fileExt,
                dateTime: moment().format('MMM DD h:mm A'),
                localUri: fileUri
            }
            await fileInfoRef
                .add(data)
                .then(resp => {
                    resetFileInfo(); // Reset the chosen file details after upload
                })
                .catch(error => {
                    alert(error)
                });
        } catch (error) {
            showAlert(error)
        }
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
                        showAlert("Please Choose a Document as "+MIME_TYPE_LIST.join(","))
                    } else if (Math.round(result.size / 1024) > 2048) { // File size validation
                        showAlert("Please Choose a Document less than 2MB")
                    } else {
                        setIsFileChosen(true)
                        setfileName(result.name)
                        setfileUri(result.uri)
                        setFileSize(result.size)
                        setFileExt(result.uri.split(".").pop().toLowerCase())
                    }
                }
            } else {
                showAlert('Sorry, we need camera roll permissions to make this work!');
            }
        } catch (e) {
            showAlert(e)
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
    const getFileList = async () => {
        setLoader(true)
        try {
            await fileInfoRef
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
        } catch (error) {
            showAlert(error)
        } finally {
            setLoader(false)
        }
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
                        showAlert("File has been deleted successfully.");
                        getFileList(); // Refresh the file list 
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
            showAlert(error)
        }
    }

    /**
     * Method to do the image sharing process
     */
    const onShareImage = async (rowItem) => {
        setLoader(true)
        try {
            if (!(await Sharing.isAvailableAsync())) {
                showAlert(`Sharing is not available on your platform`);
                return;
              }
      
              // Download the file and store into cache
              let fileUri = FileSystem.cacheDirectory + rowItem.fileName;
              await FileSystem.downloadAsync(rowItem.fileUrl, fileUri)
              .then(async ({ uri }) => {
                  await Sharing.shareAsync(rowItem.localUri); // Sharing the file into other app
              })
              .catch(error => {
                  console.error(error);
              })
        } catch (error) {
            showAlert(error)
        } finally {
            setLoader(false)
        }
    };

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
                autoClose={false}
                backgroundColor= 'transparent'>
                    <View style={styles.rowContainer}>
                        <View style={styles.iconContainer}>
                            {(rowItem.fileExt == 'pdf' || rowItem.fileExt == 'pdf' || rowItem.fileExt == 'pdf') ? 
                                <Ionicons size={36} name='document' color="grey" />
                                :
                                <FontAwesome size={36} name='image' color="grey" />
                            }
                        </View>
                        <View>
                            <View>
                                <Text style={styles.fileName} numberOfLines={1}>{rowItem.fileName}</Text>
                            </View>
                            <View style={styles.subtitleContainer}>
                                <Text style={styles.fileSize}>{rowItem.fileSize ? (rowItem.fileSize / (1024 * 1024)).toFixed(2)+" MB" : "0 KB"}</Text>
                                <Text style={styles.fileDateTime}>{ rowItem.dateTime ? moment(rowItem.dateTime).format('MMM DD h:mm A') : null }</Text>
                            </View>
                        </View>
                    </View>
            </Swipeout>
        )

    }

    return (
        <View style={styles.container}>
            <Loader loading={loader} />
            <View style={styles.logoutContainer}>
                <Text onPress={onLogoutPress} style={styles.logoutText}>Logout</Text>
                {/* <TouchableOpacity style={styles.button} onPress={onLogoutPress}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity> */}
            </View>
            
            <View style={styles.formContainer}>
                <TouchableOpacity style={styles.browseBtn} onPress={ onBrowseFile }>
                    <Text style={styles.browseBtnText} numberOfLines={1}>{isFileChosen ? fileName : `Choose file`}</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={isFileChosen ? false : true} style={[styles.button, !isFileChosen ? {backgroundColor: 'grey'} : {}]} onPress={ onUploadPress }>
                    <Text style={styles.buttonText}>{ "Upload" }</Text>
                </TouchableOpacity>
            </View>
            { fileList && (
                <FlatList
                    data={ fileList }
                    renderItem={({item, index}) => 
                        <SwipoutElement rowItem={item} rowIndex={index} />
                    } 
                    keyExtractor={item => item.id.toString()}
                />
            )}
        </View>
    )
}