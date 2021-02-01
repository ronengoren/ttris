import React, {useRef, useState, useEffect} from 'react';
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
  Animated,
} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {GameEngine} from 'react-native-game-engine';
import {GameLoop} from './Systems';
import CountDown from 'react-native-countdown-component';
import {CommonActions} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import Grid from './components/Grid';
import {
  NUMBER_OF_CELLS_HORIZONTAL,
  NUMBER_OF_CELLS_VERTICAL,
  GAME_SPEED,
} from './Constants';
import {
  AdMobBanner,
  AdMobInterstitial,
  AdMobRewarded,
  PublisherBanner,
} from 'react-native-admob';
import {addScore} from './Data/score';
import playagain from './assets/playagain.png';
import gameoveralert from './assets/gameoveralert.png';
import Score from './components/Score';
import Level from './components/Level';
import {SharedElement} from 'react-navigation-shared-element';

const BannerExample = ({style, children, ...props}) => (
  <View {...props} style={[styles.example, style]}>
    {/* <Text style={styles.title}>{title}</Text> */}
    <View>{children}</View>
  </View>
);
const ANIMATION_ONE_WIDTH = 160;
const ANIMATION_ONE_RATIO = 160 / 160;

export default function App({navigation, route}) {
  const animationOneAV = useRef(new Animated.Value(0)).current;
  const [gameEngine, setGameEngine] = useState(null);

  const [loopToggle, setLoopToggle] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [count, setCount] = useState(0);
  const [countInTimeout, setCountInTimeout] = useState(0);
  const [focused, setFocused] = useState(false);

  const [running, setRunning] = useState(false);
  const [pauseGame, setPauseGame] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVideoVisible, setModalVideoVisible] = useState(false);
  const [nextLevelModalVisible, setNextLevelModalVisible] = useState(false);
  const [loadingModalVideoVisible, setLoadingModalVideoVisible] = useState(
    true,
  );

  const [shadowOffsetWidth, setShadowOffsetWidth] = useState(10);
  const [shadowOffsetHeight, setShadowOffsetHeight] = useState(-10);
  const [shadowRadius, setShadowRadius] = useState(3);
  const [shadowOpacity, setShadowOpacity] = useState(0.3);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(40);

  let engine = useRef();
  const countRef = useRef(count);
  countRef.current = count;

  const SimpleAnimation = Animated.timing(animationOneAV, {
    duration: 5000,
    useNativeDriver: true,
  });

  useEffect(() => {
    setTimeout(() => {
      setLoadingModalVideoVisible(false);
      setRunning(true);
      setLevel(1);
    }, 5000);
  }, []);

  useEffect(() => {
    animationOneAV.setValue(0);
    SimpleAnimation.start(() => setLoopToggle(!loopToggle));
    return () => SimpleAnimation.stop();
  }, [loopToggle]);

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
      checkScore(score);
    }
  };

  const checkScore = async (score) => {
    // console.log(score);

    if (score >= level * 1000) {
      setLevel(level + 1);
      nextLevel();
    }
  };

  const nextLevel = async () => {
    setNextLevelModalVisible(true);
    setTimeout(() => {
      setNextLevelModalVisible(false);
    }, 1000);
    setGameSpeed(gameSpeed - 5);
    gameEngine.swap({
      grid: {
        grid: renderGrid(),
        nextMove: GAME_SPEED,
        updateFrequency: gameSpeed,
        renderer: <Grid />,
      },
    });
    // console.log(score);
  };
  const onAnotherGame = async (e) => {
    setModalVisible(!modalVisible);
    setModalVideoVisible(true);
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
  const onRelease = () => {
    setTimeout(() => {
      setModalVideoVisible(false);
      onFinishAdForNewGame();
    }, 5000);
  };

  const onFinishAdForNewGame = () => {
    let gameMenuFunction = route.params?.setGameOver ?? true;
    gameMenuFunction(true);

    gameEngine.swap({
      grid: {
        grid: renderGrid(),
        nextMove: GAME_SPEED,
        updateFrequency: gameSpeed,
        renderer: <Grid />,
      },
    });

    setScore(0);
    setRunning(true);
  };

  return (
    <SafeAreaView
      style={styles.container}
      onStartShouldSetResponder={onStartShouldSetResponder}
      onResponderRelease={onResponderRelease}>
      <GestureRecognizer
        onSwipeUp={() => gameEngine.dispatch({type: 'rotate'})}
        onSwipeDown={() => gameEngine.dispatch({type: 'slide'})}
        onSwipeLeft={() => gameEngine.dispatch({type: 'move-left'})}
        onSwipeRight={() => gameEngine.dispatch({type: 'move-right'})}
        config={config}
        style={{flex: 1}}>
        <StatusBar hidden={true} />

        <Score score={score} level={level} />

        <GameEngine
          ref={(ref) => {
            setGameEngine(ref);
          }}
          style={styles.gameEngine}
          systems={[GameLoop]}
          entities={{
            grid: {
              grid: renderGrid(),
              //Velocidade do jogo
              nextMove: GAME_SPEED,
              updateFrequency: gameSpeed,
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
              gameEngine.dispatch({type: 'move-left'});
            }}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              gameEngine.dispatch({type: 'move-right'});
            }}
          />
        </View>
      </GestureRecognizer>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalViewButton}>
              <View
                style={{
                  flex: 1,
                  marginBottom: 20,
                  backgroundColor: 'white',
                  opacity: 0.8,
                }}>
                <Image style={styles.gameover} source={gameoveralert} />
                <Image style={styles.gameover} source={playagain} />

                <View style={styles.modalViewButton}>
                  <TouchableHighlight
                    style={{
                      ...styles.openButton,
                      shadowOffset: {
                        width: shadowOffsetWidth,
                        height: -shadowOffsetHeight,
                      },
                      shadowOpacity,
                      shadowRadius,
                    }}
                    onPress={() => {
                      onAnotherGame();
                    }}>
                    <Image
                      style={styles.tinyLogo}
                      source={require('../src/assets/confirm.png')}
                    />
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={{
                      ...styles.openButton,
                      shadowOffset: {
                        width: shadowOffsetWidth,
                        height: -shadowOffsetHeight,
                      },
                      shadowOpacity,
                      shadowRadius,
                    }}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      navigation.navigate('GameMenu');
                    }}>
                    <Image
                      style={styles.tinyLogo}
                      source={require('../src/assets/cancel.png')}
                    />
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
          <BannerExample>
            <AdMobBanner
              adSize="smartBannerPortrait"
              // adUnitID="ca-app-pub-3940256099942544/6300978111"

              adUnitID="ca-app-pub-5713671504596281/6187910304"
              // ref={(el) => (this._smartBannerExample = el)}
            />
          </BannerExample>
        </View>
      </Modal>
      {modalVideoVisible ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVideoVisible}
          onRequestClose={() => {
            setFocused(true);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalViewButton}>
                <Animated.View
                  style={{
                    flex: 1,
                  }}>
                  <LottieView
                    autoPlay
                    loop={false}
                    source={require('../img/animations/loading.json')}
                    style={styles.loadingAnimation}
                    enableMergePathsAndroidForKitKatAndAbove
                    // progress={animationOneAV}
                    onAnimationFinish={onRelease()}
                  />
                </Animated.View>
              </View>
            </View>
          </View>
          <BannerExample>
            <AdMobBanner
              adSize="smartBannerPortrait"
              // adUnitID="ca-app-pub-3940256099942544/6300978111"

              adUnitID="ca-app-pub-5713671504596281/6187910304"
              // ref={(el) => (this._smartBannerExample = el)}
            />
          </BannerExample>
        </Modal>
      ) : null}
      {loadingModalVideoVisible ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={loadingModalVideoVisible}
          onRequestClose={() => {
            setFocused(true);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalViewButton}>
                <Animated.View
                  style={{
                    flex: 1,
                  }}>
                  <LottieView
                    autoPlay
                    loop={false}
                    source={require('../img/animations/loading.json')}
                    style={styles.loadingAnimation}
                    enableMergePathsAndroidForKitKatAndAbove
                    // progress={animationOneAV}
                    // onAnimationFinish={onRelease()}
                  />
                </Animated.View>
              </View>
            </View>
            <BannerExample>
              <AdMobBanner
                adSize="smartBannerPortrait"
                adUnitID="ca-app-pub-5713671504596281/6187910304"
                // adUnitID="ca-app-pub-3940256099942544/6300978111"

                // ref={(el) => (this._smartBannerExample = el)}
              />
            </BannerExample>
          </View>
        </Modal>
      ) : null}
      {nextLevelModalVisible ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={nextLevelModalVisible}
          onRequestClose={() => {
            setFocused(true);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalViewButton}>
                <Animated.View
                  style={{
                    flex: 1,
                  }}>
                  <LottieView
                    autoPlay
                    loop={false}
                    source={require('../img/animations/nextLevel.json')}
                    style={styles.animation}
                    enableMergePathsAndroidForKitKatAndAbove
                    // progress={animationOneAV}
                    // onAnimationFinish={onRelease()}
                  />
                </Animated.View>
              </View>
            </View>
            <BannerExample>
              <AdMobBanner
                adSize="smartBannerPortrait"
                // adUnitID="ca-app-pub-5713671504596281/6187910304"
                adUnitID="ca-app-pub-3940256099942544/6300978111"

                // ref={(el) => (this._smartBannerExample = el)}
              />
            </BannerExample>
          </View>
        </Modal>
      ) : null}
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
    // backgroundColor: 'white',
    // borderRadius: 20,
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
    fontWeight: 'bold',
    fontSize: 22,
  },
  modalViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    // margin: 40,
  },
  tinyLogo: {
    width: 80,
    height: 80,
  },
  gameover: {
    width: 100 + '%',
    height: 50,
  },
  animation: {
    width: 100 + '%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingAnimation: {
    width: 100 + '%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  example: {
    position: 'absolute',
    bottom: 1,
  },
});
