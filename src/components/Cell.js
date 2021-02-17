import React, {PureComponent} from 'react';
import {View, Image, Dimensions} from 'react-native';

import litegreen from '../assets/litegreen1.png';
import tuquie from '../assets/tuquie1.png';
import redbrown from '../assets/redbrown1.png';
import litepink from '../assets/litepink1.png';
import peach from '../assets/peach1.png';
import bordo from '../assets/bordo1.png';
import liteyellow from '../assets/liteyellow1.png';
import graypink from '../assets/graypink1.png';

import pinkpeach from '../assets/pinkpeach1.png';

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
