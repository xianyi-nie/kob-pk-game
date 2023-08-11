import { GameObject } from './GameObject';
import { Snake } from './Snake';
import { Wall } from './Wall';

export class GameMap extends GameObject {
  constructor(ctx, parent) {
    //ctx is the canvas element
    //parent is parent element of canvas element to dynamically resize
    super();
    this.ctx = ctx;
    this.parent = parent;
    this.tileSize = 0; //unit length of map
    this.rows = 20;
    this.columns = 20;
    this.walls = [];
    this.innerWallsCounts = 40;

    this.snakes = [
      new Snake(
        { id: 0, color: '#4876EC', row: this.rows - 2, column: 1 },
        this
      ),
      new Snake(
        { id: 1, color: '#F94848', row: 1, column: this.columns - 2 },
        this
      ),
    ];
  }

  start() {
    //Try 1000 times to create a map which is connected
    for (let i = 0; i < 1000; i++) {
      if (this.createWall()) {
        break;
      }
    }

    //Add event listener to the canvas element for keyboard input
    this.addListeninfEvent();
  }

  //Run every frame when game is running
  update() {
    //Resize the canvas element
    this.resize();

    //Move all snakes
    if (this.checkReady()) {
      this.moveAllSnakes();
    }
    //Draw the grass tiles
    this.draw();
  }

  /*=============================================================================
  At the start of the game
  =============================================================================*/

  createWall() {
    //Create a 2D array of boolean values to represent the map
    /* Canvas coordinate system
          ----------> x
          |
          |
          |
          y
      */

    const booleanMap = []; //i - row, j - column
    for (let r = 0; r < this.rows; r++) {
      booleanMap[r] = [];
      for (let c = 0; c < this.columns; c++) {
        booleanMap[r][c] = false;
      }
    }

    //Add each side wall
    for (let r = 0; r < this.rows; r++) {
      booleanMap[r][0] = true; //Add left wall
      booleanMap[r][this.columns - 1] = true; //Add right wall
    }

    for (let c = 0; c < this.columns; c++) {
      booleanMap[0][c] = true; //Add Top wall
      booleanMap[this.rows - 1][c] = true; //Add bottom wall
    }

    //Create a random number of walls
    for (let i = 0; i < this.innerWallsCounts / 2; i++) {
      //Try 1000 times to find a random tile that is not occupied
      for (let j = 0; j < 1000; j++) {
        let x = parseInt(Math.random() * this.rows);
        let y = parseInt(Math.random() * this.columns);
        //Avoiding tile and its centrally symmetric tile already occupied
        if (
          booleanMap[x][y] ||
          booleanMap[this.rows - 1 - x][this.columns - 1 - y]
        ) {
          continue;
        }

        //Avoid left-bottom corner and right-top corner
        if (
          (x === 1 && y === this.columns - 2) ||
          (x === this.rows - 2 && y === 1)
        ) {
          continue;
        }

        //If tile is not occupied, add wall at this tile and its centrally symmetric tile
        booleanMap[x][y] = true;
        booleanMap[this.rows - 1 - x][this.columns - 1 - y] = true;
        break;
      }
    }

    //Check if the map is connected
    const copyBooleanMap = JSON.parse(JSON.stringify(booleanMap));
    if (
      !this.checkConnection(
        copyBooleanMap,
        this.rows - 2,
        1,
        1,
        this.columns - 2
      )
    ) {
      return false;
    }

    //Transform the boolean map to wall objects
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (booleanMap[r][c]) {
          this.walls.push(new Wall(r, c, this));
        }
      }
    }
    return true;
  }

  //Leetcode 54 - Spiral Matrix
  checkConnection(map, startPointX, startPointY, targetPointX, targetPointY) {
    if (startPointX === targetPointX && startPointY === targetPointY) {
      return true;
    }
    map[startPointX][startPointY] = true;
    let dx = [-1, 0, 1, 0];
    let dy = [0, 1, 0, -1];
    for (let i = 0; i < 4; i++) {
      let x = startPointX + dx[i];
      let y = startPointY + dy[i];
      if (
        !map[x][y] &&
        this.checkConnection(map, x, y, targetPointX, targetPointY)
      ) {
        return true;
      }
    }
    return false;
  }

  addListeninfEvent() {
    this.ctx.canvas.focus();
    const [snake0, snake1] = this.snakes;
    this.ctx.canvas.addEventListener('keydown', e => {
      if (e.key === 'w') {
        snake0.setDirection(0);
      } else if (e.key === 'd') snake0.setDirection(1);
      else if (e.key === 's') snake0.setDirection(2);
      else if (e.key === 'a') snake0.setDirection(3);
      else if (e.key === 'ArrowUp') snake1.setDirection(0);
      else if (e.key === 'ArrowRight') snake1.setDirection(1);
      else if (e.key === 'ArrowDown') snake1.setDirection(2);
      else if (e.key === 'ArrowLeft') snake1.setDirection(3);
    });
  }

  /*=============================================================================
  During of the game
  =============================================================================*/

  //Dynamically resize the canvas element
  resize() {
    this.tileSize = parseInt(
      //Web ApI method to get the size of the parent element
      //clientWidth and clientHeight are the final width and height of an element - float format
      Math.min(
        this.parent.clientWidth / this.columns,
        this.parent.clientHeight / this.rows
      )
    );

    this.ctx.canvas.width = this.tileSize * this.columns;
    this.ctx.canvas.height = this.tileSize * this.rows;
  }

  //Determine whether the snake are ready for next round move
  checkReady() {
    for (const snake of this.snakes) {
      if (snake.status !== 'idle') return false;
      if (snake.direction === -1) return false;
    }
    return true;
  }

  //Move all the snakes to next round move
  moveAllSnakes() {
    for (const snake of this.snakes) {
      snake.nextStep();
    }
  }

  // Check if the ""cell""" is valid -  not collide with the two snake body and the wall
  checkCellValid(cell) {
    for (const wall of this.walls) {
      if (wall.row === cell.row && wall.column === cell.column) {
        return false;
      }
    }

    for (const snake of this.snakes) {
      let cellsNum = snake.cells.length;
      if (!snake.checkSnakeIncreasing()) {
        //If the snake is not increasing, do not check the last cell
        cellsNum--;
      }
      for (let i = 0; i < cellsNum; i++) {
        if (
          snake.cells[i].row === cell.row &&
          snake.cells[i].column === cell.column
        )
          return false;
      }
    }

    return true;
  }

  draw() {
    const color_even = '#bcda6e';
    const color_odd = '#b4d566';
    /* <<Canvas coordinate system>> - FillRect VS <<Row and Column>>
        ----------> x    ----------> c
        |                |
        |                |
        |                |
        y                r  
    */
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        this.ctx.fillStyle = (r + c) % 2 === 0 ? color_even : color_odd;
        this.ctx.fillRect(
          c * this.tileSize,
          r * this.tileSize,
          this.tileSize,
          this.tileSize
        );
      }
    }
  }
}
