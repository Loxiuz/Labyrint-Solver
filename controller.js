"use strict";

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
    this.visited = new Stack();
  }

  init() {
    console.log("Controller running...");
    this.displayBoard();
    let startCell;
    for (let row = 0; row < this.board.rows; row++) {
      for (let col = 0; col < this.board.cols; col++) {
        if (row === this.board.start.row && col === this.board.start.col) {
          startCell = this.board.maze[row][col];
        }
      }
    }
    this.visitCell(startCell);
  }

  visitCell(cell) {
    this.route.push(cell);
    this.visited.push(cell);

    console.log("Route:", this.route);
    console.log("Visited:", this.visited);

    if (cell.row === this.board.goal.row && cell.col === this.board.goal.col) {
      console.log("Game won!");
      console.log(this.route);
      this.displayBoard();
      return;
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

        if (!this.hasVisited(nextCell)) {
          if (!cell[direction]) {
            console.log("Going:", direction);
            this.visitCell(nextCell);
          }
        }
      }
    }
    console.log("Backtracking...");
    this.route.pop();
    return false;
  }

  hasVisited(cell) {
    for (let i = 0; i < this.visited.size(); i++) {
      const visited = this.visited.get(i);
      if (visited.row === cell.row && visited.col === cell.col) {
        return true;
      }
    }
    return false;
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
