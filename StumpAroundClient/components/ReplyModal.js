import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  AsyncStorage,
  Modal,
  TextInput,
} from 'react-native';
import styles from '../constants/MainStyles';

export default function BioModal(props) {

  const post = () => {
    props.replyPOST({ content: props.commentState, ...props.replyData })
    .then(async () => {
      props._updateHike();
      props.setCommentState('');
      props.setModalVisibleState(!props.modalVisibleState);
    })
  }

    return (

        // setModalVisibleState
        // modalVisibleState
        // setCommentState
        // commentState
        // commentPOST
        // _updateHike
        // hike

        // when passed to profile think of hike as profile

        <Modal
            animationType="fade"
            transparent={true}
            visible={props.modalVisibleState}
            onRequestClose={() => {
              alert('Modal has been closed.');
            }}>
            <TouchableOpacity activeOpacity={1} style={{marginTop: 22, height: "100%", backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                    props.setModalVisibleState(false);
            }}>
              <View style={{backgroundColor: 'white', borderRadius: 5, padding: 20, width: '90%', margin: 20}}>
                <Text style={{textAlign: 'center'}}>Reply:</Text>
                <TextInput
                  style={{
                    padding: 10,
                    marginTop: 20,
                    textAlign: 'center',
                  }}
                  multiline={true}
                  onChangeText={comment => props.setCommentState(comment)}
                  value={props.commentState}
                />
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Button
                    title="Post"
                    onPress={() => {
                      props.commentState.length > 0 
                      ?
                      post()
                      :
                      alert('Comments must have content.')
                    }}></Button>
                  <Button
                    title="Cancel"
                    onPress={() => {
                      props.setModalVisibleState(!props.modalVisibleState);
                    }}>
                  </Button>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
    )
}