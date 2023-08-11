import { GameObject } from './GameObject';
import { Wall } from './Wall';

export class GameMap extends GameObject {
  constructor(ctx, parent) {
    //ctx is the canvas element
    //parent is parent element of canvas element to dynamically resize
    super();
    this.ctx = ctx;
    this.parent = parent;
    this.tileSize = 0; //unit length of map
    this.rows = 13;
    this.columns = 13;
    this.walls = [];
    this.innerWallsCounts = 30;
  }

  //Leetcode 54 - Spiral Matrix
  checkConnection(map, startPointX, startPointY, targetPointX, targetPointY) {
    if (startPointX === targetPointX && startPointY === targetPointY) {
      return true;
    }
    map[startPointY][startPointX] = true;
    let dx = [-1, 0, 1, 0];
    let dy = [0, 1, 0, -1];
    for (let i = 0; i < 4; i++) {
      let x = startPointX + dx[i];
      let y = startPointY + dy[i];
      if (
        !map[y][x] &&
        this.checkConnection(map, x, y, targetPointX, targetPointY)
      ) {
        return true;
      }
    }
    return false;
  }

  createWall() {
    //Create a 2D array of boolean values to represent the map
    const booleanMap = [];
    for (let i = 0; i < this.rows; i++) {
      booleanMap[i] = [];
      for (let j = 0; j < this.columns; j++) {
        booleanMap[i][j] = false;
      }
    }

    //Add each side wall
    for (let i = 0; i < this.rows; i++) {
      booleanMap[i][0] = true; //Add left wall
      booleanMap[i][this.columns - 1] = true; //Add right wall
    }
    //Add top and bottom wall
    for (let i = 0; i < this.columns; i++) {
      booleanMap[0][i] = true; //Add top wall
      booleanMap[this.rows - 1][i] = true; //Add bottom wall
    }

    //Create a random number of walls
    for (let i = 0; i < this.innerWallsCounts / 2; i++) {
      //Try 1000 times to find a random tile that is not occupied
      for (let j = 0; j < 1000; j++) {
        let x = Math.floor(Math.random() * (this.columns - 2)) + 1;
        let y = Math.floor(Math.random() * (this.rows - 2)) + 1;
        //Avoid left-bottom corner and right-top corner
        if (
          (x === 1 && y === this.columns - 2) ||
          (x === this.rows - 2 && y === 1)
        ) {
          continue;
        }
        //If tile is occupied, try again
        if (booleanMap[y][x]) {
          continue;
        } else {
          //If tile is not occupied, add wall at this tile and its symmetric tile
          booleanMap[y][x] = true;
          booleanMap[x][y] = true;
          break;
        }
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
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (booleanMap[i][j]) {
          this.walls.push(new Wall(i, j, this));
        }
      }
    }

    return true;
  }

  start() {
    //Try 1000 times to create a map which is connected
    for (let i = 0; i < 1000; i++) {
      if (this.createWall()) {
        break;
      }
    }
  }

  resize() {
    //Web ApI method to get the size of the parent element
    //clientWidth and clientHeight are the final width and height of an element - float format
    this.tileSize = parseInt(
      Math.min(
        this.parent.clientWidth / this.columns,
        this.parent.clientHeight / this.rows
      )
    );

    this.ctx.canvas.width = this.tileSize * this.columns;
    this.ctx.canvas.height = this.tileSize * this.rows;
  }

  update() {
    //Run every frame when game is running
    this.resize();
    this.draw();
  }

  draw() {
    const color_even = '#bcda6e';
    const color_odd = '#b4d566';
    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.ctx.fillStyle = (i + j) % 2 === 0 ? color_even : color_odd;
        this.ctx.fillRect(
          i * this.tileSize,
          j * this.tileSize,
          this.tileSize,
          this.tileSize
        );
      }
    }
  }
}
