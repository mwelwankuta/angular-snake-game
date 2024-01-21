import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Position } from '../position';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngSwitch]="cellStatus">
      <div *ngSwitchCase="'food'" [ngClass]="{ cell: true, food: true }"></div>

      <div
        *ngSwitchCase="'snake'"
        [ngClass]="{ cell: true, snake_body: true }"
      ></div>

      <div
        *ngSwitchCase="'snake-head'"
        [ngClass]="{ cell: true, snake_head: true }"
      ></div>

      <div *ngSwitchDefault [ngClass]="{ cell: true }"></div>
    </div>
  `,
  styleUrl: './cell.component.css',
})
export class CellComponent implements OnChanges {
  @Input() cell!: Position;
  @Input() foodPosition!: Position;
  @Input() snakePosition!: Position[];
  @Output() onAteFood = new EventEmitter();

  cellStatus: 'cell' | 'food' | 'snake' | 'snake-head' = 'cell';

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['snakePosition'].currentValue;
    if (!change) return;
    this.snakePosition = change;

    const cellX = this.cell.x;
    const cellY = this.cell.y;

    const isSnake = this.snakePosition.some(
      (snake) => snake.x == cellX && snake.y == cellY
    );
    const isSnakeHead =
      this.snakePosition[0].x == cellX && this.snakePosition[0].y == cellY;
    const isFood = cellX == this.foodPosition.x && cellY == this.foodPosition.y;

    // check if on food
    if (
      this.snakePosition[0].x == this.foodPosition.x &&
      this.snakePosition[0].y == this.foodPosition.y
    ) {
      this.foodPosition = { x: -1, y: -1 };
      this.onAteFood.emit();
    }

    if (isSnake) {
      this.cellStatus = 'snake';
    } else {
      this.cellStatus = 'cell';
    }
    if (isSnakeHead) {
      this.cellStatus = 'snake-head';
    }
    if (isFood) {
      this.cellStatus = 'food';
    }
  }
}
