import { GameObject } from './GameObject';
import { Cell } from './Cell';

export class Snake extends GameObject {
  constructor(info, gamemap) {
    super(info, gamemap);

    this.id = info.id;
    this.color = info.color;
    this.gamemap = gamemap;
    //Cells are the body of the snake, cells[0] is the head
    this.cells = [new Cell(info.row, info.column)];

    this.speed = 5; //Run 5 tiles per timeDelta(seconds)
    this.drawScale = 0.8; //The scale of the snake body

    this.direction = -1; // -1: null, 0: up, 1: right, 2: down, 3: left
    this.status = 'idle'; // idle: not moving, moving: moving, dead: dead

    this.targetHeadCell = null; //The next cell that the snake head will move to
    this.dr = [-1, 0, 1, 0]; //4 Direction of row offset
    this.dc = [0, 1, 0, -1]; //4 Direction of column offset

    this.step = 0; //Number of rounds that the snake has moved
    this.eps = 1e-1; //Epsilon

    //0: up, 1: right, 2: down, 3: left
    if (this.id === 0) this.eyeDirection = 0; //Left-Bottom Snake with eye looking up
    if (this.id === 1) this.eyeDirection = 2; //Right-Top Snake with eye looking down

    this.eyeDx = [
      [-1, 1], //looking up
      [1, 1], //looking right
      [1, -1], //looking down
      [-1, -1], //looking left
    ];

    this.eyeDy = [
      [-1, -1],
      [-1, 1],
      [1, 1],
      [1, -1],
    ];
  }

  start() {}

  update() {
    if (this.status === 'moving') {
      this.updateSnakePosition();
    }
    this.draw();
  }

  setDirection(direction) {
    this.direction = direction;
  }

  //Check if the snake is increasing in this round
  checkSnakeIncreasing() {
    if (this.step <= 10) return true; //Increasing in the first 10 rounds
    if (this.step % 3 === 1) return true; //After 10 rounds, increasing every 3 rounds
    return false;
  }

  //Move the snake to the next cell
  nextStep() {
    //Preparation before moving
    const d = this.direction; //1. Get the direction
    this.targetHeadCell = new Cell( //2. Get the next cell that the snake head will move to
      this.cells[0].row + this.dr[d],
      this.cells[0].column + this.dc[d]
    );
    this.eyeDirection = d; //3. Update the eye direction
    this.direction = -1; //4. Reset the direction
    this.status = 'moving'; //5. Set the status to moving
    this.step++; //5. Increase the step round

    //Move the snake to the next cell - Update the cells array
    const cellsNum = this.cells.length;
    for (let i = cellsNum; i > 0; i--) {
      this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));
    }

    //Check next step - If the snake will die in the next step, set the status to dead
    if (!this.gamemap.checkCellValid(this.targetHeadCell)) {
      this.status = 'dead';
    }
  }

  updateSnakePosition() {
    const headDx = this.targetHeadCell.x - this.cells[0].x;
    const headDy = this.targetHeadCell.y - this.cells[0].y;
    const distance = Math.sqrt(headDx * headDx + headDy * headDy);

    //Calculate the distance between two cells to check if the snake has arrived the next target cell
    if (distance < this.eps) {
      //If the snake has arrived the target cell
      this.cells[0] = this.targetHeadCell; //Update the head cell
      this.targetHeadCell = null;
      this.status = 'idle';
      if (!this.checkSnakeIncreasing()) {
        //If the snake is not increasing in this round
        this.cells.pop(); //Remove the tail cell
      }
    } else {
      //If the snake has not arrived
      const moveDistance = (this.speed * this.gamemap.timeDelta) / 1000; //The distance that the snake will move in this round
      this.cells[0].x += (headDx * moveDistance) / distance;
      this.cells[0].y += (headDy * moveDistance) / distance;

      if (!this.checkSnakeIncreasing()) {
        //If the snake is not increasing in this round
        const cellsNum = this.cells.length;
        const tail = this.cells[cellsNum - 1];
        const targetTail = this.cells[cellsNum - 2];
        const tailDx = targetTail.x - tail.x;
        const tailDy = targetTail.y - tail.y;
        tail.x += (moveDistance * tailDx) / distance;
        tail.y += (moveDistance * tailDy) / distance;
      }
    }
  }

  draw() {
    /* <<Canvas coordinate system>> - FillRect VS <<Row and Column>>
        ----------> x    ----------> c
        |                |
        |                |
        |                |
        y                r  
    */
    const ctx = this.gamemap.ctx;
    const tileSize = this.gamemap.tileSize;

    ctx.fillStyle = this.color;
    //Draw the snake Dead
    if (this.status === 'dead') {
      ctx.fillStyle = 'white';
    }
    this.cells.forEach(cell => {
      //Draw the circle as cell
      ctx.beginPath();
      ctx.arc(
        cell.x * tileSize,
        cell.y * tileSize,
        (tileSize * this.drawScale) / 2, //radius
        0,
        2 * Math.PI
      );
      ctx.fill(); //Fill the circle with the color
    });

    //Fill the snake body with the color
    for (let i = 1; i < this.cells.length; i++) {
      const aCell = this.cells[i - 1]; //aCell is the previous cell, bCell is the current cell
      const bCell = this.cells[i];
      const dx = Math.abs(bCell.x - aCell.x);
      const dy = Math.abs(bCell.y - aCell.y);
      if (dx < this.eps && dy < this.eps) continue; //If the two cells are almostly same, skip
      if (dx < this.eps) {
        //If the two cells are in the same column
        ctx.fillRect(
          (aCell.x - this.drawScale * 0.5) * tileSize, //x coordinate of the left-top corner
          Math.min(aCell.y, bCell.y) * tileSize, //y coordinate of the left-top corner
          tileSize * this.drawScale, //width
          dy * tileSize //height
        );
      } else {
        //If the two cells are in the same row
        ctx.fillRect(
          Math.min(aCell.x, bCell.x) * tileSize, //x coordinate of the left-top corner
          (aCell.y - this.drawScale * 0.5) * tileSize, //y coordinate of the left-top corner
          dx * tileSize, //width
          tileSize * this.drawScale //height
        );
      }
    }

    //Draw the eyes
    ctx.fillStyle = 'black';
    for (let i = 0; i < 2; i++) {
      const eyeX = this.cells[0].x + this.eyeDx[this.eyeDirection][i] * 0.15;
      const eyeY = this.cells[0].y + this.eyeDy[this.eyeDirection][i] * 0.15;
      ctx.beginPath();
      ctx.arc(
        eyeX * tileSize,
        eyeY * tileSize,
        tileSize * this.drawScale * 0.08, //radius
        0,
        2 * Math.PI
      );
      ctx.fill(); //Fill the circle with the color
    }
  }
}
