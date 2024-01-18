import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { CellComponent } from './cell/cell.component';
import { Position } from './position';

type MoveDirection = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <main>
      <h1>Score: {{ this.score }}</h1>
      <div
        class="board"
        [ngStyle]="{ 'grid-template-columns': templateColumnStyle }"
      >
        <app-cell
          *ngFor="let cell of cells"
          [cell]="cell"
          [foodPosition]="foodPosition"
          [snakePosition]="snakePosition"
          (onAteFood)="onAteFood()"
        ></app-cell>
      </div>
    </main>
  `,
  styleUrl: './app.component.css',
  imports: [CommonModule, CellComponent],
})
export class AppComponent implements OnInit {
  score = 0;
  gridSize = 20;
  interval = 500;
  cells: Position[] = [];
  snakePosition = [
    { x: this.gridSize / 2, y: this.gridSize / 2 },
    { x: this.gridSize / 2 + 1, y: this.gridSize / 2 },
    { x: this.gridSize / 2 + 2, y: this.gridSize / 2 },
  ];

  direction: MoveDirection = 'ArrowDown';

  foodPosition = {
    x: Math.floor(Math.random() * this.gridSize),
    y: Math.floor(Math.random() * this.gridSize),
  };
  templateColumnStyle = new Array(this.gridSize).fill('1fr').join(' ');

  ngOnInit(): void {
    this.generateBoard();
    // determine number of columns for styles

    if (
      this.snakePosition[0].x >= this.gridSize ||
      this.snakePosition[0].y >= this.gridSize
    ) {
      alert('game over');
      return;
    }

    setInterval(() => {
      this.updateGame();
    }, this.interval);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.direction = event.key as MoveDirection;
  }

  onAteFood() {
    this.score += 10;
    this.interval -= 50;
    this.snakePosition.push({
      x: this.snakePosition[this.snakePosition.length - 1].x,
      y: this.snakePosition[this.snakePosition.length - 1].y,
    });
    this.foodPosition = {
      x: Math.floor(Math.random() * this.gridSize),
      y: Math.floor(Math.random() * this.gridSize),
    };
  }

  updateGame() {
    const newSnake = [...this.snakePosition];
    switch (this.direction) {
      case 'ArrowRight':
        newSnake.unshift({
          x: newSnake[0].x,
          y: newSnake[0].y + 1,
        });
        break;
      case 'ArrowLeft':
        newSnake.unshift({
          x: newSnake[0].x,
          y: newSnake[0].y - 1,
        });
        break;
      case 'ArrowUp':
        newSnake.unshift({
          x: newSnake[0].x - 1,
          y: newSnake[0].y,
        });
        break;
      case 'ArrowDown':
        newSnake.unshift({
          x: newSnake[0].x + 1,
          y: newSnake[0].y,
        });
        break;
    }
    newSnake.pop();
    this.snakePosition = newSnake;
  }

  generateBoard() {
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        this.cells.push({ x: row, y: col });
      }
    }
  }
}
