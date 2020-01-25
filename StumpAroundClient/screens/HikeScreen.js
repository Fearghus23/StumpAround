import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  Text,
  Button,
  TextInput,
  Modal,
} from 'react-native';
import styles from '../constants/MainStyles';
import CommentsBox from '../components/CommentsBox';
import CommentModal from '../components/CommentModal';
import ReplyModal from '../components/ReplyModal';
import { NavigationActions } from 'react-navigation';
import Map from '../components/Map';


export default function HikeScreen(props) {

    // props to be passed in:
    // name
    // photo
    // length
    // summary
    // comments
    // ****eventually location?

    const [hike, setHike] = useState(props.navigation.getParam('hike',{}));
    const [modalVisibleState, setModalVisibleState] = useState(false);
    const [replyModalVisibleState, setReplyModalVisibleState] = useState(false);
    const [replyData, setReplyData] = useState({});
    const [commentState, setCommentState] = useState('');
    const isPastInitialRender = useRef(false);
    const [ProfileKey, setProfileKey] = useState('');

    useEffect(() => {
          console.log('***');
          console.log(ProfileKey);
          console.log('***');
          const setParamsAction = NavigationActions.setParams({
            params: { value: Math.random() },
            key: ProfileKey,
          });
          props.navigation.dispatch(setParamsAction);
    }, [ProfileKey])

    const _retrieveKey = async () => {
      try {
        const key = await AsyncStorage.getItem('ProfileKey');
        if (key !== null) {
          setProfileKey(key);
          return;
        }
        else {
          console.log('No async storage for "ProfileKey"');
        }
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    };

    const addHikeToFavorites = async (hikeId) => {
      const token = await AsyncStorage.getItem('token');
      fetch(`https://stump-around.herokuapp.com/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({ hikeId }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
          // setHike(responseJson);
          // console.log('res2', responseJson);
          alert('Added to favorites');
          _retrieveKey();
        }
      )
      .catch((error) => {
        console.error(error);
        alert('Add failed');
      });
    }


    useEffect(() => {_updateHike();}, []);

    const commentPOST = async (data) => {
      const userId = await AsyncStorage.getItem('id');
      const newData = { ...data, user: userId };
      // console.log(newData);
      fetch(`https://stump-around.herokuapp.com/comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(newData),
        })
        .then((response) => response.json())
        .then((responseJson) => console.log('responseJson'))
        .catch((error) => {
          console.error(error);
        });
    };

    const replyPOST = async (data) => {
      // data should have property content, repliedTo, stump||hike||profile
      // {content: '', repliedTo: props.parent, [props.screen.type]: props.screen._id}
      const userId = await AsyncStorage.getItem('id');
      const newData = { ...data, user: userId };
      const response = await fetch(`https://stump-around.herokuapp.com/reply`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(newData),
          })
      return response.json();
  };

    const _updateHike = () => {
      isPastInitialRender.current = true;
      // console.log('id', hike._id);
      fetch(`https://stump-around.herokuapp.com/hike/${hike._id}`, {
          method: 'GET',
        })
        .then((response) => response.json())
        .then((responseJson) => {
            setHike(responseJson);
            // console.log('res1', responseJson);
          }
        )
        .catch((error) => {
          console.error(error);
        });
    }

    return (
        <View style={styles.container}>
          <CommentModal setModalVisibleState={setModalVisibleState} modalVisibleState={modalVisibleState} setCommentState={setCommentState} commentState={commentState} commentPOST={commentPOST} _updateHike={_updateHike} hike={hike} />
          <ReplyModal replyData={replyData} setReplyData={setReplyData} setModalVisibleState={setReplyModalVisibleState} modalVisibleState={replyModalVisibleState} setCommentState={setCommentState} commentState={commentState} replyPOST={replyPOST} _updateHike={_updateHike} hike={hike} />

            <ScrollView
            keyboardShouldPersistTaps='never'
            style={styles.hikePageBody}
            contentContainerStyle={styles.hikePageContentContainer}
            >
                {/* eventually source will be props.photo */}
                <Image source={{ uri: hike.photo }} style={{width: '100%', height: 300, resizeMode: 'cover'}} />
                <Text style={styles.hikeTitle}>
                    {hike.name}
                </Text>
                <Text style={styles.hikeLength}>
                    Length: {hike.length} mi
                </Text>
                <Button color='#24d36fff' title="Add to favorites" onPress={() => {addHikeToFavorites(hike._id)}} />
                <Text style={styles.summary}>
                    {hike.summary}
                </Text>
                <Map name={hike.name} summary={hike.summary} latitude={hike.latitude} longitude={hike.longitude} />
                <CommentsBox isPastInitialRender={isPastInitialRender} hike={hike} navigation={props.navigation} setModalVisibleState={setModalVisibleState} screen={{ type: 'hike', _id: hike._id}} replyData={replyData} setReplyData={setReplyData} setReplyModalVisibleState={setReplyModalVisibleState} replyModalVisibleState={replyModalVisibleState} />
            </ScrollView>
        </View>
    );
}

HikeScreen.navigationOptions = {
  header: null,
};
