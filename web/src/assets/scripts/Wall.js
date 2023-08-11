import { GameObject } from './GameObject';

export class Wall extends GameObject {
  constructor(row, column, gamemap) {
    super();
    this.row = row; // x and y are in tile coordinates
    this.column = column;
    this.gamemap = gamemap;
    this.color = '#b37226';
  }

  update() {
    this.draw();
  }

  draw() {
    const tileSize = this.gamemap.tileSize;
    const ctx = this.gamemap.ctx;
    ctx.fillStyle = this.color;
    /* Canvas coordinate system - FillRect
        ----------> x
        |
        |
        |
        y
    */
    ctx.fillRect(
      this.column * tileSize,
      this.row * tileSize,
      tileSize,
      tileSize
    );
  }
}
