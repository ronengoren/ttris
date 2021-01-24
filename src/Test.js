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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob';

const BannerExample = ({style, title, children, ...props}) => (
  <View {...props} style={[styles.example, style]}>
    {/* <Text style={styles.title}>{title}</Text> */}
    <View>{children}</View>
  </View>
);
export default function Test({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <Text style={styles.myText}>Login</Text>
      </View>
      <View style={styles.textWrapper1}>
        <BannerExample>
          <AdMobBanner
            adSize="smartBannerPortrait"
            adUnitID="ca-app-pub-3940256099942544/2934735716"
            testDevices={[AdMobBanner.simulatorId]}
            onAdFailedToLoad={(error) => console.error(error)}
          />
        </BannerExample>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  textWrapper: {
    height: hp('90%'), // 70% of height device screen
    width: wp('100%'), // 80% of width device screen
    backgroundColor: 'yellow',
  },
  textWrapper1: {
    height: hp('10%'), // 70% of height device screen
    width: wp('100%'), // 80% of width device screen
    backgroundColor: 'pink',
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    marginTop: 0,
  },
  myText: {
    fontSize: hp('5%'), // End result looks like the provided UI mockup
  },
  myText1: {
    fontSize: hp('5%'), // End result looks like the provided UI mockup
  },
});
