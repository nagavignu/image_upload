import { StyleSheet } from 'react-native';
import { WINDOW } from '../../config/constant';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    formContainer: {
        flexDirection: 'row',
        marginTop: WINDOW.height / 10,
        marginBottom: WINDOW.height / 25,
        flex: 1,
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    browseBtn: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'red',
        paddingLeft: 15,
        marginRight: 5
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        paddingLeft: 15,
        flex: 1,
        marginRight: 5
    },
    button: {
        height: 47,
        borderRadius: 5,
        backgroundColor: '#788eec',
        width: 80,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
    listContainer: {
        marginTop: 20,
        padding: 20,
    },
    entityContainer: {
        marginTop: 16,
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingBottom: 16
    },
    entityText: {
        fontSize: 20,
        color: '#333333'
    }
})