import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Text,
  Modal,
  TouchableHighlight,
  Image,
} from 'react-native';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import {GameEngine} from 'react-native-game-engine';
import {GameLoop} from './Systems';

import Grid from './components/Grid';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob';
import {
  NUMBER_OF_CELLS_HORIZONTAL,
  NUMBER_OF_CELLS_VERTICAL,
  GAME_SPEED,
} from './Constants';

import {addScore} from './Data/score';

import Score from './components/Score';

const BannerExample = ({style, title, children, ...props}) => (
  <View {...props} style={[styles.example, style]}>
    {/* <Text style={styles.title}>{title}</Text> */}
    <View>{children}</View>
  </View>
);

export default function App({navigation, route}) {
  const [running, setRunning] = useState(true);
  const [pauseGame, setPauseGame] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [score, setScore] = useState(0);
  var engine = useRef();

  const renderGrid = () => {
    let grid = [];

    for (i = 0; i < NUMBER_OF_CELLS_VERTICAL; i++) {
      grid[i] = [];
      for (j = 0; j < NUMBER_OF_CELLS_HORIZONTAL; j++) {
        grid[i][j] = null;
      }
    }

    return grid;
  };

  const onEvent = async (e) => {
    if (e.type === 'game-over') {
      setRunning(false);

      if (score > 0) {
        await addScore(score);
        let gameMenuFunction = route.params?.setGameOver ?? true;
        gameMenuFunction(true);
      }

      // Alert.alert('Game Over');
      // navigation.navigate('GameMenu');
      setModalVisible(true);
    } else if (e.type === 'add-score') {
      setScore(score + e.score);
    }
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const onStartShouldSetResponder = (evt) => {
    if (evt.nativeEvent.touches.length === 2) {
      setRunning(false);
    } else if (evt.nativeEvent.touches.length === 3) {
      setRunning(true);
    }
    return false;
  };
  const onResponderRelease = (evt) => {};

  return (
    <SafeAreaView
      style={styles.container}
      onStartShouldSetResponder={onStartShouldSetResponder}
      onResponderRelease={onResponderRelease}>
      <GestureRecognizer
        onSwipeUp={() => engine.dispatch({type: 'rotate'})}
        onSwipeDown={() => engine.dispatch({type: 'slide'})}
        onSwipeLeft={() => engine.dispatch({type: 'move-left'})}
        onSwipeRight={() => engine.dispatch({type: 'move-right'})}
        config={config}
        style={{flex: 1}}>
        <StatusBar hidden={true} />

        <Score score={score} />
        {/* <View style={styles.banner}>
          <BannerExample title="AdMob - Basic">
            <AdMobBanner
              adSize="smartBannerPortrait"
              adUnitID="ca-app-pub-3940256099942544/2934735716"
              testDevices={[AdMobBanner.simulatorId]}
              onAdFailedToLoad={(error) => console.error(error)}
            />
          </BannerExample>
        </View> */}
        <GameEngine
          ref={(ref) => {
            engine = ref;
          }}
          style={styles.gameEngine}
          systems={[GameLoop]}
          entities={{
            grid: {
              grid: renderGrid(),
              //Velocidade do jogo
              nextMove: GAME_SPEED,
              updateFrequency: GAME_SPEED,
              //Conponente rederizado
              renderer: <Grid />,
            },
          }}
          running={running}
          onEvent={onEvent}
        />

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              engine.dispatch({type: 'move-left'});
            }}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              engine.dispatch({type: 'move-right'});
            }}
          />
        </View>
      </GestureRecognizer>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>GAME OVER!</Text>
            <Text style={styles.modalText}>PLAY ANOTHER GAME?</Text>
            <View style={styles.modalViewButton}>
              <TouchableHighlight
                style={{...styles.openButton}}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Image
                  style={styles.tinyLogo}
                  source={require('../src/assets/blue.png')}
                />
                {/* <Text style={styles.textStyle}>YES</Text> */}
              </TouchableHighlight>
              <TouchableHighlight
                style={{...styles.openButton}}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Image
                  style={styles.tinyLogo}
                  source={require('../src/assets/red.png')}
                />
                {/* <Text style={styles.textStyle}>NO</Text> */}
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingVertical: 14,

    backgroundColor: 'black',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // flexDirection: 'column',
  },

  buttons: {
    flexDirection: 'row',
  },

  button: {
    width: Dimensions.get('screen').width / 2,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(255,255,255, 0)',
  },
  banner: {
    paddingVertical: 10,
    position: 'absolute',
    // width: widthPercentageToDP('10%'),
    // height: heightPercentageToDP('17%'),
    bottom: 0,
    justifyContent: 'center',
  },
  gameEngine: {
    bottom: 0,
    justifyContent: 'center',

    // paddingBottom: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    // backgroundColor: '#F194FF',
    // borderRadius: 50,
    padding: 10,
    elevation: 2,
    margin: 4,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalViewButton: {
    flexDirection: 'row',
    // margin: 40,
  },
  tinyLogo: {
    width: 80,
    height: 80,
  },
});
