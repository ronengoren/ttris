import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import bestscorebg from '../assets/bestscorebg.png';

export default function BestScores({data}) {
  const renderScores = () => {
    return data.map((element, index) => (
      <Text key={index} style={styles.text}>
        {index + 1} - {element}
      </Text>
    ));
  };

  return (
    <View style={styles.container}>
      {data && (
        <View style={styles.scores}>
          <Image style={styles.tinyLogo} source={bestscorebg} />
          {/* <Text
            style={[
              styles.text,
              {fontSize: 18, marginBottom: 5, fontWeight: 'bold'},
            ]}>
            YOUR BEST SCORES
          </Text> */}
          {renderScores()}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 75 + '%',
    margin: 40,
    // position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 25,
    paddingBottom: 50,
    // borderRadius: 30,
    borderColor: 'white',
    borderWidth: 2,
    backgroundColor: 'black',
  },

  text: {
    fontSize: 15,
    color: '#88FF55',
    // paddingBottom: 5,

    // borderRadius: 20,
  },
  tinyLogo: {
    width: 80 + '%',
    height: 19,
    justifyContent: 'center',
    alignItems: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});
