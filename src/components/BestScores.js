import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import bestscorebg from '../assets/bestscorebg.png';
import {
  AdMobBanner,
  AdMobInterstitial,
  AdMobRewarded,
  PublisherBanner,
} from 'react-native-admob';

const BannerExample = ({style, title, children, ...props}) => (
  <View {...props} style={[styles.example, style]}>
    <Text style={styles.title}>{title}</Text>
    <View>{children}</View>
  </View>
);

const bannerWidths = [200, 250, 320];

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
      <Image style={styles.tinyLogo} source={bestscorebg} />
      {data && (
        <View style={styles.scores}>
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
    width: Dimensions.get('window').width / 1.3,

    // margin: 40,
    height: Dimensions.get('window').height / 4,
    // position: 'absolute',
    bottom: 0,
    left: 0,
    // padding: 25,
    paddingBottom: 25,
    paddingTop: 20,

    // borderRadius: 30,
    borderColor: 'white',
    borderWidth: 2,
    backgroundColor: 'black',
  },

  text: {
    fontSize: 20,
    color: '#88FF55',
    paddingLeft: 20,
    fontFamily: 'EarlsRevenge',

    // paddingBottom: 5,

    // borderRadius: 20,
  },
  tinyLogo: {
    width: 80 + '%',
    height: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});
