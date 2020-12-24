import { StyleSheet } from 'react-native';
import { BTN_BG_COLOR, LINK_TEXT_COLOR, PLACEHOLDER_TEXT_COLOR, WINDOW } from '../../config/constant';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    iconContainer: {
        width: 50
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        width: WINDOW.width / 1.15,
        borderRadius: 5,
        margin: 1,
        paddingHorizontal: 5,
        paddingVertical: 10
    },
    subtitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    fileName: {
        width: WINDOW.width / 1.5,
        fontWeight: '600',
        fontSize: 14
    },
    fileSize: {
        fontSize: 12,
        color: "grey",
        fontWeight: '500'
    },
    fileDateTime: {
        fontSize: 12,
        color: "grey",
        fontWeight: '500'
    },
    formContainer: {
        flexDirection: 'row',
        padding: 30,
    },
    browseBtn: {
        height: 48,
        width: WINDOW.width / 1.5,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        paddingLeft: 15,
        marginHorizontal: 5
    },
    browseBtnText: {
        color: PLACEHOLDER_TEXT_COLOR,
        marginTop: 15
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
        backgroundColor: BTN_BG_COLOR,
        width: WINDOW.width / 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
    logoutContainer: {
        alignSelf: 'flex-end',
        margin: 10
    },
    logoutText: {
        color: LINK_TEXT_COLOR,
        fontWeight: "bold",
        fontSize: 16
    }
})