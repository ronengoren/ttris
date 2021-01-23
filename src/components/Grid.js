import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

import Cell from './Cell';

import {WIDTH_SCREEN, HEIGHT_SCREEN} from '../Constants';

export default function Grid({grid}) {
  const cells = () => {
    let finalCells = [];
    let keyValue = 0;

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        finalCells.push(<Cell key={keyValue} color={grid[i][j]} />);
        keyValue++;
      }
    }

    return finalCells;
  };

  return <View style={styles.container}>{cells()}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH_SCREEN,
    height: HEIGHT_SCREEN,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

// import React, {useState, useEffect, useRef} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   Modal,
// } from 'react-native';
// import Preview from './Preview';
// import {belongs, createRandomBlock} from './Helpers';
// import Cellcomp from './Cellcomp';

// const Grid = (props) => {
//   const [score, setScore] = useState(0);
//   const [blocks, setBlocks] = useState();
//   const [grid, setGrid] = useState([]);
//   const [speed, setSpeed] = useState(450);
//   const [numBlocks, setNumBlocks] = useState(5);
//   const [started, setStarted] = useState(false);
//   const [gameOver, setGameOver] = useState(true);
//   const [currentBlock, setCurrentBlock] = useState('J');
//   const [w, setW] = useState(props.w);
//   const [h, setH] = useState(props.h);
//   const [color, setColor] = useState();
//   const checkColorRef = useRef([]);
//   const changeColorRef = useRef([]);
//   const interval = useRef(null);

//   useEffect(() => {
//     createGrid();
//     setBlocks(generateBlocks());
//   }, []);

//   createGrid = () => {
//     var grid = [];
//     var row = [];

//     for (i = 1; i <= h; i++) {
//       //h is 20, so i want 20 rows
//       for (j = 1; j <= w; j++) {
//         // w is 10
//         var cell = 0;
//         row.push(cell);
//       }
//       grid.push(row);
//       row = [];
//     }
//     this.grid = grid;
//     setGrid(grid);
//   };
//   renderCells = () => {
//     const size = 24;
//     return grid.map((row, i) => {
//       if (i < 4) {
//         return (
//           <View key={i} style={{height: 0, flexDirection: 'row'}}>
//             {row.map((cell, j) => {
//               const color = 'white';
//               return (
//                 <TouchableOpacity
//                   key={j}
//                   onPress={() => changeColor(i, j, 'blue')}>
//                   {/* <Cellcomp ref={i + ',' + j} color={color} size={size} /> */}
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         );
//       }
//       return (
//         <View key={i} style={{flexDirection: 'row'}}>
//           {row.map((cell, j) => {
//             const color = 'white';
//             if (cell == 1) {
//               color = 'blue';
//             } else if (cell == 2) {
//               color = 'green';
//             }
//             if (i < 4) {
//               color = 'red';
//             }
//             return (
//               <TouchableOpacity
//                 key={j}
//                 onPress={() => {
//                   return; //production
//                   changeColor(i, j, 'blue');
//                 }}>
//                 {/* <Cellcomp
//                   ref={i + ',' + j}
//                   borderWidth={1}
//                   color={color}
//                   size={size}
//                 /> */}
//               </TouchableOpacity>
//             );
//           })}
//         </View>
//       );
//     });
//   };
//   renderButtons = () => {
//     return (
//       <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
//         <TouchableOpacity onPress={() => shiftCells('left')}>
//           <Image
//             style={styles.img}
//             source={require('../../img/left-filled.png')}
//           />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => shiftCells('right')}>
//           <Image
//             style={styles.img}
//             source={require('../../img/right-filled.png')}
//           />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => down()}>
//           <Image
//             style={styles.img}
//             source={require('../../img/down_arrow.png')}
//           />
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => rotate()}>
//           <Image
//             style={styles.img}
//             source={require('../../img/rotate_arrow.png')}
//           />
//         </TouchableOpacity>
//       </View>
//     );
//   };
//   renderStart = () => {
//     return (
//       <Modal
//         animationType={'slide'}
//         transparent={true}
//         visible={gameOver}
//         style={{flex: 1}}>
//         <View
//           style={{
//             flex: 1,
//             justifyContent: 'center',
//             alignItems: 'center',
//             backgroundColor: 'rgba(0,0,0,.5)',
//           }}>
//           <Text style={{fontSize: 64, fontWeight: '800'}}>
//             <Text style={{color: 'blue'}}>T</Text>
//             <Text style={{color: 'orange'}}>E</Text>
//             <Text style={{color: 'yellow'}}>T</Text>
//             <Text style={{color: 'green'}}>R</Text>
//             <Text style={{color: 'red'}}>I</Text>
//             <Text style={{color: 'cyan'}}>S</Text>
//           </Text>

//           <TouchableOpacity
//             onPress={() => {
//               started ? tryAgain() : startGame();
//             }}>
//             <Text style={{fontSize: 32, color: 'white', fontWeight: '500'}}>
//               {started ? 'TRY AGAIN' : 'START'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     );
//   };

//   tryAgain = () => {
//     setGameOver(false);
//     setScore(0);
//     refresh();
//     startGame();
//   };
//   startGame = () => {
//     setGameOver(false);
//     setStarted(true);
//     setScore(0);
//     loadNextBlock();
//     clearInterval(interval);
//     interval.current = setInterval(() => {
//       tick();
//     }, speed);
//   };
//   refresh = () => {
//     for (i = 4; i < 24; i++) {
//       for (j = 0; j < 10; j++) {
//         changeColor(i, j, 'white');
//       }
//     }
//   };
//   changeColor = (i, j, color) => {
//     const id = i + ',' + j;
//     const bin = color == 'white' ? 0 : 1;
//     grid[i][j] = bin;
//     changeColorRef[id].setColor(color);
//   };
//   checkColor = (i, j) => {
//     const id = `${i},${j}`;
//     if (changeColorRef[id] == null) {
//       return null;
//     }
//     // console.log(this.refs[id].state.color);
//     return checkColorRef[id].setColor(color);
//   };
//   generateBlocks = () => {
//     const blocksArray = [];
//     for (i = 0; i < 5; i++) {
//       blocksArray.push({id: i, ...createRandomBlock()});
//     }
//     return blocksArray;
//   };

//   shiftCells = (direction) => {
//     const points = [];
//     for (i = 4; i < 24; i++) {
//       //h is 20, so i want 20 rows
//       for (j = 0; j < 10; j++) {
//         // w is 10
//         if (belongs(checkColor(i, j))) {
//           if (i == 4) {
//             return;
//           }
//           points.push({i, j});
//         }
//       }
//     }

//     const can = canShift(points, direction);
//     if (can) {
//       shift(points, direction);
//     }
//   };

//   canShift = (points, direction) => {
//     const can = true;
//     const shift = direction == 'left' ? -1 : 1;
//     points.map((point) => {
//       if (checkColor(point.i, point.j + shift) == null) {
//         can = false;
//       }

//       if (checkColor(point.i, point.j + shift) == 'gray') {
//         can = false;
//       }
//     });
//     return can;
//   };

//   shift = (points, direction) => {
//     const shift = direction == 'left' ? -1 : 1;
//     if (direction == 'right') {
//       points = points.reverse();
//     }
//     points.map((point) => {
//       changeColor(point.i, point.j + shift, checkColor(point.i, point.j));
//       changeColor(point.i, point.j, 'white');
//     });
//   };

//   down = () => {
//     clearInterval(interval);
//     speed = 10;
//     interval = setInterval(() => {
//       tick();
//     }, speed);
//   };

//   tick = () => {
//     const points = [];
//     for (i = 23; i >= 0; i--) {
//       //h is 20, so i want 20 rows
//       for (j = 9; j >= 0; j--) {
//         // w is 10
//         if (belongs(checkColor(i, j))) {
//           points.push({i, j});
//         }
//       }
//     }

//     const can = canMoveDown(points);
//     if (can) {
//       moveDown(points);
//     }

//     if (!can && grid[3].includes(1)) {
//       clearInterval(interval);
//       for (i = 23; i >= 0; i--) {
//         //h is 20, so i want 20 rows
//         for (j = 9; j >= 0; j--) {
//           // w is 10
//           if (belongs(checkColor(i, j))) {
//             // console.log('blue found on: ', i, j);
//             changeColor(i, j, 'gray');
//           }
//         }
//       }
//       setGameOver(true);
//       console.log('game over');
//       return;
//     }

//     if (!can) {
//       for (i = 23; i >= 0; i--) {
//         //h is 20, so i want 20 rows
//         for (j = 9; j >= 0; j--) {
//           // w is 10
//           if (belongs(checkColor(i, j))) {
//             // console.log('blue found on: ', i, j);
//             changeColor(i, j, 'gray');
//           }
//         }
//       }
//       //cant move down

//       can = true;
//       checkRowsToClear();
//       loadNextBlock();
//     }
//   };

//   rotate = () => {
//     if (grid[3].includes(1)) {
//       return;
//     }

//     rotation += 1;
//     const color = '';
//     const points = [];
//     const previous = [];
//     for (i = 4; i < 24; i++) {
//       //h is 20, so i want 20 rows
//       for (j = 0; j < 10; j++) {
//         // w is 10
//         if (belongs(checkColor(i, j))) {
//           color = checkColor(i, j);
//           changeColor(i, j, 'white');
//           points.push([i, j]);
//           previous.push([i, j]);
//         }
//       }
//     }

//     const rotated = rotate(currentBlock, points, rotation);
//     if (canRotate(rotated)) {
//       // console.log('valid rotation');
//       rotated.map((point) => {
//         changeColor(point[0], point[1], color);
//       });
//     } else {
//       // console.log('invalid rotation');
//       previous.map((point) => {
//         changeColor(point[0], point[1], color);
//       });
//     }
//   };

//   canRotate = (p) => {
//     const points = p;
//     const canRotate = true;
//     // console.log(points);
//     points.map((point) => {
//       if (point[0] == null || point[1] == null) {
//         canRotate = false;
//       } else {
//         if (checkColor(point[0], point[1]) == null) {
//           canRotate = false;
//         }
//         if (checkColor(point[0], point[1]) == 'gray') {
//           canRotate = false;
//         }
//       }
//     });
//     return canRotate;
//   };
//   canMoveDown = (points) => {
//     const canmove = true;
//     points.map((point) => {
//       if (checkColor(point.i + 1, point.j) == null) {
//         canmove = false;
//       }

//       if (checkColor(point.i + 1, point.j) == 'gray') {
//         canmove = false;
//       }
//     });
//     return canmove;
//   };

//   moveDown = (points) => {
//     points.map((point) => {
//       changeColor(point.i + 1, point.j, checkColor(point.i, point.j));
//       changeColor(point.i, point.j, 'white');
//     });
//   };

//   checkRowsToClear = () => {
//     clearInterval(interval);
//     const row_was_cleared = false;
//     const num_rows_cleared = 0;
//     const rows_to_clear = [];
//     for (i = 23; i >= 4; i--) {
//       if (!grid[i].includes(0)) {
//         console.log('adding row', i);
//         rows_to_clear.push(i);
//       }
//     }

//     rows_to_clear.map((r) => {
//       clearRow(r);
//       num_rows_cleared++;
//       row_was_cleared = true;
//     });

//     if (row_was_cleared) {
//       setScore(score + 1000 * num_rows_cleared);
//     }
//   };

//   loadNextBlock = () => {
//     setSpeed(450);
//     clearInterval(interval.current);
//     setInterval((interval) => {
//       tick();
//     }, speed);
//     const next = blocks.splice(0, 1)[0];
//     setCurrentBlock(next.type);
//     rotation = 0;
//     // console.log(next);
//     if (next.type == 'I') {
//       changeColor(3, 3, next.color);
//       changeColor(3, 4, next.color);
//       changeColor(3, 5, next.color);
//       changeColor(3, 6, next.color);
//     } else if (next.type == 'O') {
//       changeColor(2, 4, next.color);
//       changeColor(2, 5, next.color);
//       changeColor(3, 4, next.color);
//       changeColor(3, 5, next.color);
//     } else if (next.type == 'T') {
//       changeColor(2, 4, next.color);
//       changeColor(3, 3, next.color);
//       changeColor(3, 4, next.color);
//       changeColor(3, 5, next.color);
//     } else if (next.type == 'S') {
//       changeColor(2, 4, next.color);
//       changeColor(2, 5, next.color);
//       changeColor(3, 3, next.color);
//       changeColor(3, 4, next.color);
//     } else if (next.type == 'Z') {
//       changeColor(2, 3, next.color);
//       changeColor(2, 4, next.color);
//       changeColor(3, 4, next.color);
//       changeColor(3, 5, next.color);
//     } else if (next.type == 'J') {
//       changeColor(2, 3, next.color);
//       changeColor(3, 3, next.color);
//       changeColor(3, 4, next.color);
//       changeColor(3, 5, next.color);
//     } else if (next.type == 'L') {
//       changeColor(2, 5, next.color);
//       changeColor(3, 3, next.color);
//       changeColor(3, 4, next.color);
//       changeColor(3, 5, next.color);
//     }
//     blocks.push({id: next.id + 5, ...createRandomBlock()});
//     setBlocks(blocks);
//   };
//   return (
//     <View style={{flex: 1, justifyContent: 'space-around'}}>
//       <View
//         style={{
//           paddingTop: 40,
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         <Text style={{fontWeight: '700', fontSize: 26}}>
//           REACT-NATIVE-TETRIS
//         </Text>
//         <Text style={{paddingTop: 10, fontSize: 16}}>Score: {score}</Text>
//       </View>
//       <View style={{flexDirection: 'row', justifyContent: 'center'}}>
//         <View style={{backgroundColor: 'white'}}>{renderCells()}</View>
//         <View style={{marginLeft: 20, alignItems: 'center'}}>
//           <Text style={{fontSize: 16, fontWeight: '600'}}>NEXT</Text>
//           {/* <Preview blocks={blocks} /> */}
//         </View>
//       </View>
//       {renderButtons()}

//       {renderStart()}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   img: {
//     width: 50,
//     height: 50,
//   },
// });
// export default Grid;
