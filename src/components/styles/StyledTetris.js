import styled from 'styled-components/native';
import bgImage from '../../../img/bg.png';
import {Dimensions} from 'react-native';

const userInput = 'https://picsum.photos/200/300';

export const StyledTetrisWrapper = styled.View`
  width: ${Dimensions.get('window').width}px;
  height: ${Dimensions.get('window').height}px;
  background-color: papayawhip;
  overflow: hidden;
`;
export const StyledTetris = styled.Text`
  display: flex;
  align-items: flex-start;
  padding: 40px;
  margin: 0 auto;
  max-width: 900px;
`;
export const StyledAside = styled(StyledTetris)`
  width: 100%;
  max-width: 200px;
  padding: 0 20px;
  display: none;
`;
