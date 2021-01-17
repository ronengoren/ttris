import styled from 'styled-components/native';

export const StyledDisplay = styled.Text`
  display: flex;
  align-items: center;
  margin: 0 0 20px 0;
  padding: 20px;
  border: 4px solid #333;
  min-height: 30px;
  width: 100%;
  border-radius: 20px;
  color: ${(props) => (props.gameOver ? 'red' : '#999')};
  background: #000;
  font-family: 'Helvetica Neue';
`;
