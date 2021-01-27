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

import NativeAdView, {
  CallToActionView,
  IconView,
  HeadlineView,
  TaglineView,
  AdvertiserView,
  AdBadge,
  StarRatingView,
  MediaView,
  StoreView,
} from 'react-native-admob-native-ads';
import {
  NUMBER_OF_CELLS_HORIZONTAL,
  NUMBER_OF_CELLS_VERTICAL,
  GAME_SPEED,
} from './Constants';

import {addScore} from './Data/score';

import playagain from './assets/playagain.png';

import gameoveralert from './assets/gameoveralert.png';
import Score from './components/Score';

playagain;
const BannerExample = ({style, title, children, ...props}) => (
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

  const [running, setRunning] = useState(true);
  const [pauseGame, setPauseGame] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVideoVisible, setModalVideoVisible] = useState(false);
  const [shadowOffsetWidth, setShadowOffsetWidth] = useState(10);
  const [shadowOffsetHeight, setShadowOffsetHeight] = useState(-10);
  const [shadowRadius, setShadowRadius] = useState(3);
  const [shadowOpacity, setShadowOpacity] = useState(0.3);
  const [score, setScore] = useState(0);
  let engine = useRef();
  const countRef = useRef(count);
  countRef.current = count;

  const SimpleAnimation = Animated.timing(animationOneAV, {
    duration: 5000,
    useNativeDriver: true,
  });

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
    }
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
    let engine;
    gameEngine.swap({
      grid: {
        grid: renderGrid(),
        nextMove: GAME_SPEED,
        updateFrequency: GAME_SPEED,
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

        <Score score={score} />

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

                <NativeAdView
                  style={{
                    width: '95%',
                    alignSelf: 'center',
                    height: 100,
                  }}
                  adUnitID="ca-app-pub-3940256099942544/2247696110" // TEST adUnitID
                >
                  <View
                    style={{
                      height: 100,
                      width: '100%',
                    }}>
                    <AdBadge />
                    <View
                      style={{
                        height: 100,
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                      }}>
                      <IconView
                        style={{
                          width: 60,
                          height: 60,
                        }}
                      />
                      <View
                        style={{
                          width: '65%',
                          maxWidth: '65%',
                          paddingHorizontal: 6,
                        }}>
                        <HeadlineView
                          style={{
                            fontWeight: 'bold',
                            fontSize: 13,
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </NativeAdView>
              </View>
            </View>
          </View>
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
                  {/* <Text style={styles.modalText}>{countInTimeout}</Text> */}
                  {/* <CountDown
                    until={5}
                    onFinish={() => onFinishAdForNewGame()}
                    // onPress={() => onFinishAdForNewGame()}
                    size={20}
                    timeLabels={{s: null}}
                    timeToShow={['']}
                    digitStyle={{
                      backgroundColor: '#FFF',
                      borderWidth: 2,
                      borderColor: '#1CC625',
                    }}
                    digitTxtStyle={{color: '#1CC625'}}
                  /> */}
                  <LottieView
                    autoPlay
                    loop={false}
                    source={require('../img/animations/loading.json')}
                    style={styles.animation}
                    enableMergePathsAndroidForKitKatAndAbove
                    // progress={animationOneAV}
                    onAnimationFinish={onRelease()}
                  />
                  <NativeAdView
                    refreshInterval={60000 * 2}
                    style={{
                      width: '98%',
                      alignSelf: 'center',
                      marginVertical: 10,
                    }}
                    adUnitID="ca-app-pub-3940256099942544/3986624511" // TEST adUnitID
                  >
                    <View
                      style={{
                        width: '100%',
                      }}>
                      <View
                        style={{
                          height: 100,
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingHorizontal: 10,
                        }}>
                        <IconView
                          style={{
                            width: 60,
                            height: 60,
                          }}
                        />
                        <View
                          style={{
                            width: '60%',
                            maxWidth: '60%',
                            paddingHorizontal: 6,
                          }}>
                          <HeadlineView
                            hello="abc"
                            style={{
                              fontWeight: 'bold',
                              fontSize: 13,
                            }}
                          />
                          <TaglineView
                            numberOfLines={2}
                            style={{
                              fontSize: 11,
                            }}
                          />
                          <AdvertiserView
                            style={{
                              fontSize: 10,
                              color: 'gray',
                            }}
                          />

                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <StarRatingView
                              starSize={12}
                              fullStarColor="orange"
                              emptyStarColor="gray"
                              containerStyle={{
                                width: 65,
                                marginTop: 4,
                              }}
                            />

                            <StoreView
                              style={{
                                fontSize: 12,
                                marginLeft: 10,
                              }}
                            />
                          </View>
                        </View>
                        <CallToActionView
                          style={{
                            minHeight: 45,
                            paddingHorizontal: 12,
                            backgroundColor: 'purple',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 5,
                            elevation: 10,
                            maxWidth: 100,
                          }}
                          allCaps
                          textStyle={{
                            color: 'white',
                            fontSize: 13,
                            flexWrap: 'wrap',
                            textAlign: 'center',
                          }}
                        />
                      </View>
                    </View>
                  </NativeAdView>
                </Animated.View>
              </View>
            </View>
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
    backgroundColor: 'white',
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
    height: 80,
  },
  animation: {
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
