import React, {PureComponent} from 'react';
import {View, Image, Dimensions} from 'react-native';

import green from '../assets/green.png';
import blue from '../assets/blue.png';
import brown from '../assets/brown.png';
import pink from '../assets/pink.png';
import purple from '../assets/purple.png';
import red from '../assets/red.png';
import yellow from '../assets/yellow.png';
import gray from '../assets/gray.png';

import litegreen from '../assets/litegreen.png';
import tuquie from '../assets/tuquie.png';
import redbrown from '../assets/redbrown.png';
import litepink from '../assets/litepink.png';
import peach from '../assets/peach.png';
import bordo from '../assets/bordo.png';
import liteyellow from '../assets/liteyellow.png';
import graypink from '../assets/graypink.png';

import pinkpeach from '../assets/pinkpeach.png';

import {CELL_LENGTH} from '../Constants';

export default class Cell extends PureComponent {
  render() {
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
      <View>
        <Image
          source={color(this.props.color)}
          style={{width: CELL_LENGTH, height: CELL_LENGTH}}
        />
      </View>
    );
  }
}
