import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import GameMenu from './GameMenu';
import Game from './Game';
import {
  AdMobBanner,
  AdMobInterstitial,
  AdMobRewarded,
  PublisherBanner,
} from 'react-native-admob';
const Stack = createStackNavigator();

const Routes: () => React$Node = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="GameMenu" headerMode="none">
          <Stack.Screen name="GameMenu" component={GameMenu} />
          <Stack.Screen name="Game" component={Game} />
        </Stack.Navigator>
      </NavigationContainer>
      <AdMobBanner
        adSize="smartBannerPortrait"
        adUnitID={
          Platform.OS === 'ios'
            ? 'ca-app-pub-5713671504596281/6117645587'
            : 'ca-app-pub-5713671504596281/1412113813'
        }
        onAdFailedToLoad={(error) => console.error(error)}
        style={styles.ad}
      />
    </>
  );
};

const styles = StyleSheet.create({
  ad: {
    position: 'absolute',
    bottom: 1,
    width: 100 + '%',
    height: 100 + '%',
  },
});

export default Routes;
