import React from 'react';
import {StyledStartButton} from './styles/StyledStartButton';

const StartButton = ({callback}) => (
  <StyledStartButton onClick={callback} title="Start Game"></StyledStartButton>
);

export default StartButton;
