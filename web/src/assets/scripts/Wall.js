import { GameObject } from './GameObject';

export class Wall extends GameObject {
  constructor(x, y, gamemap) {
    super();
    this.x = x; // x and y are in tile coordinates
    this.y = y;
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

    ctx.fillRect(this.x * tileSize, this.y * tileSize, tileSize, tileSize);
  }
}
