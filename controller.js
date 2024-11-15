"use strict";

import MazeSolver from "./mazeSolver.js";
import Stack from "./stack.js";

window.addEventListener("load", async () => {
  const res = await fetch("maze.json");
  const boardData = await res.json();
  const c = new Controller(boardData);
  c.init();
});

class Controller {
  constructor(boardData) {
    this.board = boardData;
    this.route = new Stack();
  }

  init() {
    console.log("Controller running...");
    this.solver();
    this.displayBoard();
  }

  solver() {
    const startCell =
      this.board.maze[this.board.start.row][this.board.start.col];
    const solver = new MazeSolver(this.board, startCell);
    const route = solver.solve();
    if (route) {
      this.route = route;
    }
  }

  displayBoard() {
    document.querySelector(
      "#game"
    ).innerHTML = `<div id="board" style="grid-template-columns: repeat(${
      this.board.cols
    }, 1fr); width: ${this.board.cols * 20}px"></div>`;
    let cellNo = 0;
    for (let rows = 0; rows < this.board.rows; rows++) {
      for (let cols = 0; cols < this.board.cols; cols++) {
        cellNo++;
        document.querySelector("#board").insertAdjacentHTML(
          "beforeend",
          `
                <div class="cell" id="cell${cellNo}"></div>
                `
        );
        const cell = this.board.maze[rows][cols];
        const cellElement = document.querySelector(`#cell${cellNo}`);
        if (cell.north) {
          cellElement.classList.add("north");
        }
        if (cell.east) {
          cellElement.classList.add("east");
        }
        if (cell.west) {
          cellElement.classList.add("west");
        }
        if (cell.south) {
          cellElement.classList.add("south");
        }
        if (rows === this.board.start.row && cols === this.board.start.col) {
          cellElement.classList.add("start");
        } else if (
          rows === this.board.goal.row &&
          cols === this.board.goal.col
        ) {
          cellElement.classList.add("goal");
        }
        if (this.route) {
          for (let i = 0; i < this.route.size(); i++) {
            const routeCell = this.route.get(i);
            if (routeCell.row === cell.row && routeCell.col === cell.col) {
              cellElement.innerHTML = `<div class="route"></div>`;
            }
          }
        }
      }
    }
  }
}
