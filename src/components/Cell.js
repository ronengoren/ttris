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

import {CELL_LENGTH} from '../Constants';

export default class Cell extends PureComponent {
  render() {
    const color = (c) => {
      switch (c) {
        case 'green': {
          return green;
        }

        case 'brown': {
          return brown;
        }

        case 'blue': {
          return blue;
        }

        case 'purple': {
          return purple;
        }

        case 'pink': {
          return pink;
        }

        case 'red': {
          return red;
        }

        case 'yellow': {
          return yellow;
        }

        default: {
          return gray;
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

// import React from 'react';
// import {View} from 'react-native';
// import {TETROMINOS} from '../tetrominos';
// import {
//   widthPercentageToDP,
//   heightPercentageToDP,
// } from 'react-native-responsive-screen';

// const Cell = ({type}) => (
//   <View
//     style={{
//       width: 20,
//       height: 20,
//       backgroundColor: `rgba(${TETROMINOS[type].color}, 0.8)`,
//       borderWidth: type === 0 ? 0 : 4,
//       borderBottomColor: `rgba(${TETROMINOS[type].color}, 0.1)`,
//       borderRightColor: `rgba(${TETROMINOS[type].color}, 1)`,
//       borderTopColor: `rgba(${TETROMINOS[type].color}, 1)`,
//       borderLeftColor: `rgba(${TETROMINOS[type].color}, 0.3)`,
//     }}></View>
// );

// export default React.memo(Cell);
