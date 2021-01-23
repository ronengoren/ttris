import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import CreateBlock from './CreateBlock';

const Preview = ({props}) => {
  const [score, setScore] = useState(0);

  renderCells = () => {};
  renderButtons = () => {};
  renderStart = () => {};

  return (
    <View style={{flex: 1, justifyContent: 'space-around'}}>
      {props.blocks.map((block) => {
        return (
          <CreateBlock key={block.id} type={block.type} color={block.color} />
        );
      })}
    </View>
  );
};

export default Preview;
