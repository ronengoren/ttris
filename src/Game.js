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

      Alert.alert('Game Over');
      navigation.navigate('GameMenu');
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
      <TouchableOpacity
        onPress={() => {
          setRunning(true);
        }}>
        <Text>stop</Text>
      </TouchableOpacity>
      <View style={styles.banner}>
        <BannerExample title="AdMob - Basic">
          {/* <AdMobBanner
            adSize="smartBannerPortrait"
            adUnitID="ca-app-pub-3940256099942544/2934735716"
            testDevices={[AdMobBanner.simulatorId]}
            onAdFailedToLoad={(error) => console.error(error)}
          /> */}
        </BannerExample>
      </View>
    </SafeAreaView>
  );
}

//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
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
});
