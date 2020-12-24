import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';

const Loader = ({loading}) => {

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {}}>
      <View style={styles.modalBackground}>
        <UIActivityIndicator color="white" />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  }
});

export default Loader;