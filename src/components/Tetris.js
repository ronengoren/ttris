import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Button,
  Dimensions,
  Modal,
  TouchableHighlight,
} from 'react-native';
import Display from './Display';
import Stage from './Stage';
import Icon from 'react-native-vector-icons/Ionicons';
import {createStage, checkCollision} from '../gameHelpers';

import {useInterval} from '../hooks/useInterval';
import {usePlayer} from '../hooks/usePlayer';
import {useStage} from '../hooks/useStage';
import {useGameStatus} from '../hooks/useGameStatus';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob';
import LottieView from 'lottie-react-native';

const BannerExample = ({style, title, children, ...props}) => (
  <View {...props} style={[styles.example, style]}>
    {/* <Text style={styles.title}>{title}</Text> */}
    <View>{children}</View>
  </View>
);

const Tetris = () => {
  const [background, setBackground] = useState({
    uri: 'https://picsum.photos/500/900',
  });
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [pause, setPause] = useState(false);

  const [player, resetPlayer, updatePlayer, playerRotate] = usePlayer(stage);
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
    rowsCleared,
  );
  const [levelModalVisible, setLevelModalVisible] = useState(false);
  const [progress, setProgress] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  movePlayer = (dir) => {
    if (!checkCollision(player, stage, {x: dir, y: 0})) {
      updatePlayer({x: dir, y: 0});
    }
  };

  startGame = () => {
    setScore(0);
    setGameOver(false);
    resetPlayer();
    setDropTime(800);
    setLevel(0);
    setRows(0);
    setStage(createStage());
  };

  pauseGame = () => {
    setPause(!pause);
    if (!pause) {
      global.cacheDropTime = dropTime;
      setDropTime(null);
    } else {
      setDropTime(global.cacheDropTime ? global.cacheDropTime : 800);
    }
  };

  drop = () => {
    // console.log(rows);
    // Increase level when player has cleared 10 rows
    if (rows > (level + 1) * 10) {
      setLevel((prev) => prev + 1);
      ChangeBackground();
      setPause(!pause);
      // Also increase speed
      setDropTime(800 / (level + 1) + 160);
    }

    if (!checkCollision(player, stage, {x: 0, y: 1})) {
      updatePlayer({x: 0, y: 1, collided: false});
    } else {
      if (player.pos.y < 1) {
        // gameOver
        global.cacheDropTime = null;
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayer({x: 0, y: 0, collided: true});
    }
  };

  dropPlayer = () => {
    drop();
  };

  useInterval(() => {
    drop();
  }, dropTime);

  ChangeBackground = async () => {
    setModalVisible(true);
    try {
      const result = await fetch('https://picsum.photos/500/900');

      setBackground({uri: result.url});
    } catch (error) {
      const image = {uri: 'https://picsum.photos/500/900'};
      setBackground(image);
    }
    setModalVisible(false);
    setPause(pause);
  };

  ChangeScore = async (score) => {
    console.log(score);
  };
  // const image = {uri: 'https://picsum.photos/500/900'};

  // https://picsum.photos/500/900
  setAnim = (anim) => {
    anim = anim;
  };
  return (
    <ImageBackground
      source={background}
      style={{width: '100%', height: '100%', justifyContent: 'center'}}>
      {gameOver ? (
        <Display gameOver={gameOver} text="Game Over" />
      ) : (
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <View style={styles.modalView}>
                <LottieView
                  ref={setAnim}
                  autoPlay={!progress}
                  source={require('../../img/animations/wrongAnswer')}
                  progress={progress}
                  loop={false}
                  enableMergePathsAndroidForKitKatAndAbove
                />
              </View>
            </Modal>
          </View>
          <Display gameOver={gameOver} text={`Score: ${score}`} />
          <Display gameOver={gameOver} text={`rows: ${rows}`} />
          <Display gameOver={gameOver} text={`Level: ${level}`} />
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <Stage stage={stage} />
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <TouchableOpacity style={styles.button} onPress={() => startGame()}>
            <Icon name="play-outline" style={{color: '#FFF', fontSize: 40}} />
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!global.cacheDropTime && !dropTime}
            style={styles.button}
            onPress={() => pauseGame()}>
            <Icon
              name={!pause ? 'pause-circle-outline' : 'pause-circle'}
              style={{color: '#FFF', fontSize: 40}}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => playerRotate(stage)}
        style={[styles.button, {alignSelf: 'center', marginTop: 10}]}>
        <Icon name="flash-outline" color="#FFF" size={16} />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          // alignItems: 'center'
        }}>
        <TouchableOpacity onPress={() => movePlayer(-1)} style={styles.button}>
          <Icon name="arrow-back-outline" color="#FFF" size={16} />
        </TouchableOpacity>
        <View
          style={[
            styles.button,
            {borderWidth: 0, backgroundColor: 'transparent'},
          ]}
        />
        <TouchableOpacity onPress={() => movePlayer(1)} style={styles.button}>
          <Icon name="arrow-forward-outline" size={16} color="#FFF" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => dropPlayer()}
        style={[styles.button, {alignSelf: 'center', marginBottom: 90}]}>
        <Icon name="arrow-down-outline" size={16} color="#FFF" />
      </TouchableOpacity>

      <View style={styles.banner}>
        <BannerExample title="AdMob - Basic">
          <AdMobBanner
            adSize="smartBannerPortrait"
            adUnitID="ca-app-pub-3940256099942544/6300978111"
            testDevices={[AdMobBanner.simulatorId]}
            onAdFailedToLoad={(error) => console.error(error)}
          />
        </BannerExample>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 5,
    borderColor: '#333',
    backgroundColor: '#000',
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  example: {
    // paddingVertical: 10,
    position: 'absolute',

    bottom: 0,
  },
  banner: {
    // paddingVertical: 10,
    position: 'absolute',

    bottom: 0,
    justifyContent: 'center',
  },
  title: {
    margin: 10,
    fontSize: 20,
  },
  container: {
    marginTop: Platform.OS === 'ios' ? 30 : 10,
    position: 'absolute',
    bottom: 0,
  },
  centeredView: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    flex: 1,
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
    backgroundColor: '#F194FF',
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
});

export default Tetris;
