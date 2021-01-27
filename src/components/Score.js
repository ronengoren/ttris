import React from 'react';
import {SafeAreaView, Text, StyleSheet, Dimensions} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
export default function Score({score}) {
  return (
    <SafeAreaView style={styles.score}>
      <Text style={styles.txtScore}>SCORE: {score}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  score: {
    height: 50,
    width: Dimensions.get('window').width,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },

  txtScore: {
    color: '#88FF55',
    fontSize: 22,
    fontFamily: 'Iowan Old Style',
  },
});
