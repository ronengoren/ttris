import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';

import Cellcomp from './Cellcomp';

const CreateBlock = (props) => {
  const [type, setType] = useState(props.type);
  const [color, setColor] = useState(props.color);
  const [rotation, setRotation] = useState(false);
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(4);
  const [grid, setGrid] = useState([]);

  createBlockGrid = () => {
    let grid = [];
    let row = [];
    for (i = 0; i < height; i++) {
      for (j = 0; j < width; j++) {
        row.push(0);
      }
      grid.push(row);
      row = [];
    }
    colorGrid(grid);
  };

  colorGrid = (grid) => {
    if (type == 'I') {
      grid[0][0] = 1;
      grid[0][1] = 1;
      grid[0][2] = 1;
      grid[0][3] = 1;
    } else if (type == 'O') {
      grid[1][1] = 1;
      grid[1][2] = 1;
      grid[2][1] = 1;
      grid[2][2] = 1;
    } else if (type == 'T') {
      grid[0][1] = 1;
      grid[1][0] = 1;
      grid[1][1] = 1;
      grid[1][2] = 1;
    } else if (type == 'S') {
      grid[0][1] = 1;
      grid[0][2] = 1;
      grid[1][0] = 1;
      grid[1][1] = 1;
    } else if (type == 'Z') {
      grid[0][0] = 1;
      grid[0][1] = 1;
      grid[1][1] = 1;
      grid[1][2] = 1;
    } else if (type == 'J') {
      grid[0][0] = 1;
      grid[1][0] = 1;
      grid[1][1] = 1;
      grid[1][2] = 1;
    } else if (type == 'L') {
      grid[0][2] = 1;
      grid[1][0] = 1;
      grid[1][1] = 1;
      grid[1][2] = 1;
    }
    setGrid(grid);
  };

  renderBlockGrid = () => {
    let size = 10;
    return grid.map((row, i) => {
      return (
        <View key={i} style={{flexDirection: 'row'}}>
          {row.map((cell, j) => {
            let c = 'white';
            if (cell == 1) {
              c = color;
            }
            return <Cellcomp ref={i + ',' + j} key={j} color={c} size={size} />;
          })}
        </View>
      );
    });
    console.log('renderBlockGrid');
  };

  return <View style={{margin: 10}}>{renderBlockGrid()}</View>;
};

export default CreateBlock;
