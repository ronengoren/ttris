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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel, {Pagination, ParallaxImage} from 'react-native-snap-carousel';
import LottieView from 'lottie-react-native';

import * as Animatable from 'react-native-animatable';
import BestScores from './components/BestScores';

import logo from './assets/logo.png';
import pressstart from './assets/pressstart.png';
import openhowto from './assets/openhowto.png';
import closehowto from './assets/closehowto.png';
import score from './assets/score.png';

const SliderWidth = Dimensions.get('window').width - 200;
const IS_ANDROID = Platform.OS === 'android';
const IS_IOS = Platform.OS === 'ios';
const entryBorderRadius = 8;

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');
export default function GameMenu({navigation, route}) {
  const [anim, setAnim] = useState();
  const [activeIndex, setActivateIndex] = useState(0);
  const [progress, setProgress] = useState(null);

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

  const [gameOver, setGameOver] = useState(true);
  const [restartGame, setRestartGame] = useState(false);
  const [bestScores, setBestScores] = useState(null);
  const [background, setBackground] = useState({
    uri: 'https://picsum.photos/500/900',
  });

  useEffect(() => {
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
  ChangeBackground = async () => {
    try {
      const result = await fetch('https://picsum.photos/500/900');

      setBackground({uri: result.url});
    } catch (error) {
      const image = {uri: 'https://picsum.photos/500/900'};

      setBackground(image);
    }
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

  return (
    <ImageBackground
      source={background}
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
      }}>
      <SafeAreaView style={styles.container}>
        <Image source={logo} style={styles.logo} />

        <Animatable.View
          animation="jello"
          easing="ease-out"
          iterationCount="infinite">
          <TouchableOpacity style={styles.btnStart} onPress={() => StartGame()}>
            <Image source={pressstart} style={styles.logo} />
          </TouchableOpacity>
        </Animatable.View>

        <TouchableOpacity
          style={styles.openButton}
          onPress={() => {
            setModalVisible(true);
          }}>
          <Image source={openhowto} style={styles.logo} />
        </TouchableOpacity>
        <BestScores data={bestScores}></BestScores>
      </SafeAreaView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: 40 + '%',
                height: 40 + '%',
              }}>
              <Carousel
                autoplay={true}
                enableMomentum={false}
                lockScrollWhileSnapping={true}
                layout={'default'}
                ref={this.carouselRef}
                data={carouselStateAsset}
                sliderWidth={SliderWidth}
                itemWidth={200}
                hasParallaxImages={true}
                inactiveSlideScale={0.94}
                inactiveSlideOpacity={0.7}
                containerCustomStyle={styles.slider}
                contentContainerCustomStyle={styles.sliderContentContainer}
                renderItem={this._renderItem}
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
            <Image source={closehowto} style={styles.logo} />
          </TouchableOpacity>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 300,
    height: 60,
    marginBottom: 70,
  },

  btnStart: {
    // paddingTop: 30,
    // backgroundColor: '#FFF',
  },

  txtBtnStart: {
    fontSize: 20,
    color: '#006400',
    paddingHorizontal: 30,
    paddingVertical: 20,
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
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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
  animation: {
    width: 80,

    // height: 100,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
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
    fontSize: 12,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    fontWeight: 'bold',
    textAlign: 'center',
    // backgroundColor: 'black',
    marginBottom: 50,
  },
  dotStyle: {
    // marginBottom: 60,
  },
  paginationContainer: {
    marginTop: 60,
  },
});
