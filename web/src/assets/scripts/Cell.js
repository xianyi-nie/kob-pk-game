/* <<Canvas coordinate system>> - FillRect VS <<Row and Column>>
    ----------> x    ----------> c
    |                |
    |                |
    |                |
    y                r  
*/

export class Cell {
  constructor(row, column) {
    this.row = row;
    this.column = column;
    this.x = column + 0.5;
    this.y = row + 0.5;
  }
}
