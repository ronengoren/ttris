import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//animacoes
import * as Animatable from 'react-native-animatable';

import logo from './assets/logo.png';

import BestScores from './components/BestScores';
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
console.log(screenWidth);
export default function GameMenu({navigation}) {
  const [gameOver, setGameOver] = useState(true);
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
      ChangeBackground();

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
    navigation.navigate('Game', {setGameOver});
    ChangeBackground();
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
          animation="pulse"
          easing="ease-out"
          iterationCount="infinite">
          <TouchableOpacity style={styles.btnStart} onPress={() => StartGame()}>
            <Text style={styles.txtBtnStart}>Start</Text>
          </TouchableOpacity>
        </Animatable.View>

        <BestScores data={bestScores}></BestScores>
      </SafeAreaView>
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
    width: 200,
    height: 40,
    marginBottom: 30,
  },

  btnStart: {
    backgroundColor: '#FFF',
  },

  txtBtnStart: {
    fontSize: 20,
    color: '#006400',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
});
