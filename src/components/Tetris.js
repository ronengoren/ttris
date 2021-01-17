import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import Display from './Display';
import Stage from './Stage';
import Icon from 'react-native-vector-icons/Ionicons';
import {createStage, checkCollision} from '../gameHelpers';

import {useInterval} from '../hooks/useInterval';
import {usePlayer} from '../hooks/usePlayer';
import {useStage} from '../hooks/useStage';
import {useGameStatus} from '../hooks/useGameStatus';

const Tetris = () => {
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [pause, setPause] = useState(false);

  const [player, resetPlayer, updatePlayer, playerRotate] = usePlayer(stage);
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
    rowsCleared,
  );

  // console.log('re-render')

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
    // Increase level when player has cleared 10 rows
    if (rows > (level + 1) * 10) {
      setLevel((prev) => prev + 1);
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

  return (
    <ImageBackground
      source={require('../../img/bg.png')}
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
        <TouchableOpacity style={styles.button} onPress={() => startGame()}>
          <Text style={{color: '#FFF'}}>START</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!global.cacheDropTime && !dropTime}
          style={styles.button}
          onPress={() => pauseGame()}>
          <Text style={{color: '#FFF'}}>{!pause ? 'Pause' : 'Unpause'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => playerRotate(stage)}
        style={[styles.button, {alignSelf: 'center', marginTop: 10}]}>
        <Icon name="arrow-up-outline" style={{color: '#333', fontSize: 20}} />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          // alignItems: 'center'
        }}>
        <TouchableOpacity onPress={() => movePlayer(-1)} style={styles.button}>
          <Icon
            name="arrow-back-outline"
            style={{color: '#333', fontSize: 20}}
          />
        </TouchableOpacity>
        <View
          style={[
            styles.button,
            {borderWidth: 0, backgroundColor: 'transparent'},
          ]}
        />
        <TouchableOpacity onPress={() => movePlayer(1)} style={styles.button}>
          <Icon name="arrow-forward-outline" size={16} color="#333" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => dropPlayer()}
        style={[styles.button, {alignSelf: 'center'}]}>
        <Icon name="arrow-down-outline" size={20} color="#333" />
      </TouchableOpacity>
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
});

export default Tetris;
