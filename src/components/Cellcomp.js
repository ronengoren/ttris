import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const Cellcomp = (props) => {
  const [color, setColor] = useState(props.color);
  const [size, setSize] = useState(props.size);
  const [borderWidth, setBorderWidth] = useState(props.size);

  changeColor = (color) => {
    setColor(color);
    if (color != 'white') {
      borderWidth = 1;
    }
  };
  return (
    <View
      style={[
        styles.cell,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderWidth: borderWidth,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  cell: {
    borderColor: 'black',
  },
});

export default Cellcomp;
