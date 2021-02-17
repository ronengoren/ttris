import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  Modal,
  TouchableHighlight,
  Platform,
  Button,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel, {Pagination, ParallaxImage} from 'react-native-snap-carousel';
import LottieView from 'lottie-react-native';

import * as Animatable from 'react-native-animatable';
import BestScores from './components/BestScores';

import pressstart from './assets/pressstart.png';
import openhowto from './assets/openhowto.png';
import closehowto from './assets/closehowto.png';
import score from './assets/score.png';
import {
  AdMobBanner,
  AdMobInterstitial,
  AdMobRewarded,
  PublisherBanner,
} from 'react-native-admob';
import {
  NUMBER_OF_CELLS_HORIZONTAL,
  NUMBER_OF_CELLS_VERTICAL,
  GAME_SPEED,
  CELL_LENGTH,
  WIDTH_SCREEN,
  HEIGHT_SCREEN,
} from './Constants';
import litegreen from './assets/litegreen1.png';
import tuquie from './assets/tuquie1.png';
import redbrown from './assets/redbrown1.png';
import litepink from './assets/litepink1.png';
import peach from './assets/peach1.png';
import bordo from './assets/bordo1.png';
import liteyellow from './assets/liteyellow1.png';
import graypink from './assets/graypink1.png';

import pinkpeach from './assets/pinkpeach1.png';
import {GameEngine} from 'react-native-game-engine';
import {GameLoop} from './Systems';
import Grid from './components/Grid';
import {SharedElement} from 'react-navigation-shared-element';
import TouchableScale from 'react-native-touchable-scale';
import Icon from 'react-native-vector-icons/Ionicons';

AdMobInterstitial.setAdUnitID('ca-app-pub-5713671504596281/5644315940');

const SliderWidth = Dimensions.get('window').width - 200;
const IS_ANDROID = Platform.OS === 'android';
const IS_IOS = Platform.OS === 'ios';
const entryBorderRadius = 8;

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');

showModalAd = () => {
  // AdMobInterstitial.requestAd()
  //   .then(() => {
  //     receiveHint();
  //     AdMobInterstitial.showAd();
  //   })
  //   .catch((err) => {
  //     receiveHint();
  //   });
};
const bannerWidths = [200, 250, 320];

export default function GameMenu({navigation, route}) {
  const [anim, setAnim] = useState();
  const [activeIndex, setActivateIndex] = useState(0);
  const [progress, setProgress] = useState(null);
  const [carouselRef, setCarouselRef] = useState(null);
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);

  const [carouselStateAsset, setCarouselStateAsset] = useState([
    {
      id: '1',
      title: 'TAP OR SWIPE RIGHT & LEFT TO MOVE BRICKS',
      lottiAnimation: require('../img/animations/rightHelper.json'),
      slideBackground: require('../src/assets/inappbordo.png'),
      screen: 'TOUCH OR SWIPE TO MOVE BRICKS',
    },
    {
      id: '2',
      title: 'SWIPE DOWN TO DROP A BRICK',
      lottiAnimation: require('../img/animations/swipeDownHelper.json'),
      slideBackground: require('../src/assets/inappbrown.png'),
      screen: 'swipeDownHelper',
    },
    {
      id: '3',
      title: 'SWIPE UP TO ROTATE A BRICK',
      lottiAnimation: require('../img/animations/leftHelper.json'),
      slideBackground: require('../src/assets/inappgreen.png'),
      screen: 'leftHelper',
    },
    {
      id: '4',
      title: 'TAP WITH 2 FINGERS SCREEN TO PAUSE',
      lottiAnimation: require('../img/animations/pauseHelper.json'),
      slideBackground: require('../src/assets/inappturquize.png'),
      screen: 'pauseHelper',
    },
    {
      id: '5',
      title: 'TAP WITH 3 FINGERS TO UNPAUSE',
      lottiAnimation: require('../img/animations/unPauseHelper.json'),
      slideBackground: require('../src/assets/inappyellow.png'),
      screen: 'Quiz',
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [fluidSizeIndex, setFluidSizeIndex] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [restartGame, setRestartGame] = useState(false);
  const [bestScores, setBestScores] = useState(null);
  const [background, setBackground] = useState({
    uri: 'http://placeimg.com/500/900/arch ',
  });

  useEffect(() => {
    ChangeBackground();
    // RenderGrid();
    async function scores() {
      try {
        let data = await AsyncStorage.getItem('Best_Scores');

        setBestScores(JSON.parse(data));
        setGameOver(false);
      } catch (e) {
        console.log(e);
      }
    }

    if (gameOver == true) {
      scores();
    }
  }, [gameOver]);

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
  ChangeBackground = async () => {
    try {
      const result = await fetch('http://placeimg.com/500/900/arch');

      setBackground({uri: result.url});
    } catch (error) {
      const image = {uri: 'http://placeimg.com/500/900/arch'};

      setBackground(image);
    }
  };

  showModalAd = () => {
    AdMobInterstitial.requestAd()
      .then(() => {
        StartGame();

        AdMobInterstitial.showAd();
      })
      .catch((err) => {
        StartGame();
      });
  };

  StartGame = async () => {
    navigation.navigate('Game', {setGameOver, setRestartGame});
    ChangeBackground();
  };

  RestartGame = () => {
    // console.log(restartGame);
  };

  const renderPagination = () => (
    <Pagination
      dotsLength={carouselStateAsset.length}
      activeDotIndex={activeIndex}
      dotStyle={styles.dotStyle}
      containerStyle={styles.paginationContainer}
    />
  );

  _renderItem = ({item, index}, parallaxProps) => {
    return (
      <ImageBackground
        source={item.slideBackground}
        style={{
          borderRadius: 5,
          height: 250,
          padding: 40,
          marginLeft: 25,
          marginRight: 25,
          marginTop: 145,
        }}>
        <LottieView
          autoPlay
          loop={true}
          source={item.lottiAnimation}
          style={styles.animation}
          enableMergePathsAndroidForKitKatAndAbove
        />
        <Text style={styles.title}>{item.title}</Text>
      </ImageBackground>
    );
  };

  const color = (c) => {
    switch (c) {
      case 'green': {
        return litegreen;
      }

      case 'brown': {
        return redbrown;
      }

      case 'blue': {
        return tuquie;
      }

      case 'purple': {
        return peach;
      }

      case 'pink': {
        return litepink;
      }

      case 'red': {
        return bordo;
      }

      case 'yellow': {
        return liteyellow;
      }

      default: {
        return graypink;
      }
    }
  };

  return (
    <ImageBackground
      source={background}
      style={{
        width: 100 + '%',
        height: 100 + '%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <SafeAreaView style={styles.container}>
        {/* <GameEngine
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
      /> */}
        {/* <LottieView
        autoPlay
        loop={true}
        source={require('../img/animations/logo.json')}
        style={styles.logo}
        enableMergePathsAndroidForKitKatAndAbove
      /> */}
        {/* <Image source={logo} style={styles.logo} /> */}
        <TouchableOpacity
          style={styles.openHowToButton}
          onPress={() => {
            setModalVisible(true);
          }}>
          {/* <Image source={openhowto} style={styles.logobottom} /> */}
          <Icon name="help-circle" size={60} color="#88FF55" />
        </TouchableOpacity>
        <Animatable.View
          animation="jello"
          easing="ease-out"
          iterationCount="infinite">
          <TouchableOpacity style={styles.btnStart} onPress={() => StartGame()}>
            <Image source={pressstart} style={styles.logobottom} />
          </TouchableOpacity>
        </Animatable.View>

        {/* <TouchableOpacity
        style={styles.openButton}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Image source={openhowto} style={styles.logobottom} />
      </TouchableOpacity> */}

        <View style={{flex: 1, marginBottom: 160}}>
          <BestScores data={bestScores} style={styles.bestScores}></BestScores>
        </View>

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  // width: 40 + '%',
                  // height: 40 + '%',
                }}>
                <Carousel
                  autoplay={true}
                  enableMomentum={false}
                  lockScrollWhileSnapping={true}
                  layout={'default'}
                  ref={carouselRef}
                  data={carouselStateAsset}
                  sliderWidth={SliderWidth}
                  itemWidth={200}
                  hasParallaxImages={true}
                  inactiveSlideScale={0.94}
                  inactiveSlideOpacity={0.7}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  renderItem={_renderItem}
                  useScrollView
                  onSnapToItem={(index) => setActivateIndex(index)}
                  activeSlideAlignment="center"
                />
              </View>
            </View>
            {renderPagination()}

            <TouchableOpacity
              style={{...styles.openButton}}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Image source={closehowto} style={styles.logobottom} />
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'flex-start',
    // justifyContent: 'center',
    // padding: 20,
  },

  logo: {
    // margin: 100,
    width: Dimensions.get('window').width / 1.7,
    // height: 72,
    top: 1,
    position: 'absolute',
  },

  logobottom: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height / 7,
    // marginBottom: 100,
  },

  btnStart: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2.5,
    // flex: 1,
    paddingVertical: 40,
  },
  bestScores: {},

  txtBtnStart: {
    // fontSize: 20,
    // color: '#006400',
    // paddingHorizontal: 30,
    // paddingVertical: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    // margin: 20,
    // backgroundColor: 'white',
    // borderRadius: 20,
    // padding: 35,
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    // backgroundColor: '#F194FF',
    // borderRadius: 20,
    // padding: 30,
    // elevation: 2,
  },
  openHowToButton: {
    width: Dimensions.get('window').width / 1.2,
  },
  textStyle: {
    // color: 'white',
    // fontWeight: 'bold',
    // textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  animation: {
    width: 80,
    // height: 100,
  },
  // image: {
  //   ...StyleSheet.absoluteFillObject,
  //   resizeMode: 'cover',
  // },
  imageContainer: {
    // flex: 1,
    // marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    // backgroundColor: 'white',
    // borderRadius: 8,
  },
  slider: {
    // marginTop: 5,
    overflow: 'visible', // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 10, // for custom animation
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: IS_IOS ? entryBorderRadius : 0,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
  title: {
    // fontSize: 12,
    // textAlign: 'center',
    // alignItems: 'center',
    // justifyContent: 'center',
    // alignSelf: 'center',
    // fontWeight: 'bold',
    // textAlign: 'center',
    // // backgroundColor: 'black',
    // marginBottom: 50,
  },
  dotStyle: {
    // marginBottom: 60,
  },
  paginationContainer: {
    marginTop: 60,
  },
  example: {
    position: 'absolute',
    bottom: 1,
  },

  gameEngine: {
    // bottom: 0,
    // justifyContent: 'center',
    // paddingBottom: 14,
  },
});
