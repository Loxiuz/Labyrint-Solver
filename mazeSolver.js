import Stack from "./stack.js";

export default class MazeSolver {
  constructor(board, startCell) {
    this.board = board;
    this.cell = startCell;
    this.route = new Stack();
    this.visited = new Stack();
  }

  solve() {
    if (this.#visitCell(this.cell)) {
      return this.route;
    }
    return null;
  }

  #visitCell(cell) {
    this.route.push(cell);
    this.visited.push(cell);

    // console.log("Route:", this.route);
    // console.log("Visited:", this.visited);

    if (cell.row === this.board.goal.row && cell.col === this.board.goal.col) {
      console.log("Game won!");
      console.log(this.route);
      return true;
    }

    let newRow;
    let newCol;

    const directions = ["north", "east", "west", "south"];

    for (const direction of directions) {
      switch (direction) {
        case "north":
          newRow = cell.row - 1;
          newCol = cell.col + 0;
          break;
        case "east":
          newRow = cell.row + 0;
          newCol = cell.col + 1;
          break;
        case "west":
          newRow = cell.row + 0;
          newCol = cell.col - 1;
          break;
        case "south":
          newRow = cell.row + 1;
          newCol = cell.col + 0;
          break;
      }

      if (
        newRow >= 0 &&
        newRow < this.board.rows &&
        newCol >= 0 &&
        newCol < this.board.cols
      ) {
        const nextCell = this.board.maze[newRow][newCol];

        if (!this.#hasVisited(nextCell)) {
          if (!cell[direction]) {
            console.log("Going:", direction);
            if (this.#visitCell(nextCell)) {
              return true;
            }
          }
        }
      }
    }
    console.log("Backtracking...");
    this.route.pop();
    return false;
  }

  #hasVisited(cell) {
    for (let i = 0; i < this.visited.size(); i++) {
      const visited = this.visited.get(i);
      if (visited.row === cell.row && visited.col === cell.col) {
        return true;
      }
    }
    return false;
  }
}
