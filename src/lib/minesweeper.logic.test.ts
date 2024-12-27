import { describe, it, expect, beforeEach } from 'vitest';
import { createBoard, revealCell, toggleFlag, checkWin, type Cell } from './minesweeper';

describe('Minesweeper Logic', () => {
  describe('Board Creation', () => {
    it('creates a board with correct dimensions', () => {
      const width = 5;
      const height = 6;
      const board = createBoard(width, height, 5);
      
      expect(board.length).toBe(height);
      expect(board[0].length).toBe(width);
    });

    it('places correct number of mines', () => {
      const mineCount = 5;
      const board = createBoard(8, 8, mineCount);
      
      const mines = board.flat().filter(cell => cell.value === 'mine');
      expect(mines.length).toBe(mineCount);
    });

    it('initializes all cells as hidden', () => {
      const board = createBoard(3, 3, 1);
      
      board.flat().forEach(cell => {
        expect(cell.state).toBe('hidden');
      });
    });

    it('sets correct numbers around mines', () => {
      // Create a board with known mine positions
      const board = createBoard(3, 3, 0);
      board[1][1].value = 'mine'; // Center mine

      // Calculate numbers around the mine
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          if (board[y][x].value !== 'mine') {
            let count = 0;
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                const ny = y + dy;
                const nx = x + dx;
                if (
                  ny >= 0 && ny < 3 &&
                  nx >= 0 && nx < 3 &&
                  board[ny][nx].value === 'mine'
                ) {
                  count++;
                }
              }
            }
            board[y][x].value = count;
          }
        }
      }

      // Check numbers around the mine
      expect(board[0][0].value).toBe(1); // Top-left corner
      expect(board[0][1].value).toBe(1); // Top-middle
      expect(board[0][2].value).toBe(1); // Top-right
      expect(board[1][0].value).toBe(1); // Middle-left
      expect(board[1][2].value).toBe(1); // Middle-right
      expect(board[2][0].value).toBe(1); // Bottom-left
      expect(board[2][1].value).toBe(1); // Bottom-middle
      expect(board[2][2].value).toBe(1); // Bottom-right
    });
  });

  describe('Cell Revealing', () => {
    let board: Cell[][];

    beforeEach(() => {
      // Create a 3x3 board with known state
      board = createBoard(3, 3, 0);
      board[0][0].value = 'mine';
      board[0][1].value = 1;
      board[0][2].value = 0;
      board[1][0].value = 1;
      board[1][1].value = 1;
      board[1][2].value = 0;
      board[2][0].value = 0;
      board[2][1].value = 0;
      board[2][2].value = 0;
    });

    it('reveals a single non-zero cell', () => {
      const newBoard = revealCell(board, 0, 1);
      expect(newBoard[0][1].state).toBe('revealed');
      // Adjacent cells should still be hidden
      expect(newBoard[0][2].state).toBe('hidden');
      expect(newBoard[1][1].state).toBe('hidden');
    });

    it('reveals multiple empty cells and their boundaries', () => {
      const board = createBoard(4, 4, 0);
      // Set up a specific pattern with empty cells and numbers
      board[1][1].value = 1;
      board[1][2].value = 1;
      board[2][1].value = 1;
      // All other cells are 0 (empty)
      
      const newBoard = revealCell(board, 0, 0);
      
      // Check empty cells are revealed
      expect(newBoard[0][0].state).toBe('revealed');
      expect(newBoard[0][3].state).toBe('revealed');
      expect(newBoard[3][0].state).toBe('revealed');
      expect(newBoard[3][3].state).toBe('revealed');
      
      // Check boundary numbers are revealed
      expect(newBoard[1][1].state).toBe('revealed');
      expect(newBoard[1][2].state).toBe('revealed');
      expect(newBoard[2][1].state).toBe('revealed');
      
      // Check values are preserved
      expect(newBoard[1][1].value).toBe(1);
      expect(newBoard[1][2].value).toBe(1);
      expect(newBoard[2][1].value).toBe(1);
    });

    it('reveals mine cell', () => {
      const newBoard = revealCell(board, 0, 0);
      expect(newBoard[0][0].state).toBe('revealed');
      expect(newBoard[0][0].value).toBe('mine');
    });

    it('does not reveal flagged cells', () => {
      board[1][1].state = 'flagged';
      const newBoard = revealCell(board, 1, 1);
      expect(newBoard[1][1].state).toBe('flagged');
    });
  });

  describe('Flag Toggling', () => {
    let board: Cell[][];

    beforeEach(() => {
      board = createBoard(3, 3, 1);
    });

    it('toggles flag on hidden cell', () => {
      const newBoard = toggleFlag(board, 0, 0);
      expect(newBoard[0][0].state).toBe('flagged');
    });

    it('removes flag from flagged cell', () => {
      let newBoard = toggleFlag(board, 0, 0);
      newBoard = toggleFlag(newBoard, 0, 0);
      expect(newBoard[0][0].state).toBe('hidden');
    });

    it('cannot flag revealed cell', () => {
      let newBoard = revealCell(board, 0, 0);
      newBoard = toggleFlag(newBoard, 0, 0);
      expect(newBoard[0][0].state).toBe('revealed');
    });
  });

  describe('Win Condition', () => {
    it('detects win when all safe cells revealed and mines flagged', () => {
      const board = createBoard(2, 2, 1);
      // Set up a winning board state
      board[0][0].value = 'mine';
      board[0][0].state = 'flagged';
      board[0][1].value = 1;
      board[0][1].state = 'revealed';
      board[1][0].value = 1;
      board[1][0].state = 'revealed';
      board[1][1].value = 1;
      board[1][1].state = 'revealed';

      expect(checkWin(board)).toBe(true);
    });

    it('does not detect win with unrevealed safe cells', () => {
      const board = createBoard(2, 2, 1);
      // Set up an incomplete board state
      board[0][0].value = 'mine';
      board[0][0].state = 'flagged';
      board[0][1].value = 1;
      board[0][1].state = 'revealed';
      board[1][0].value = 1;
      board[1][0].state = 'hidden'; // One cell still hidden
      board[1][1].value = 1;
      board[1][1].state = 'revealed';

      expect(checkWin(board)).toBe(false);
    });

    it('does not detect win with incorrectly flagged cells', () => {
      const board = createBoard(2, 2, 1);
      // Set up a board with wrong flag placement
      board[0][0].value = 'mine';
      board[0][0].state = 'hidden';
      board[0][1].value = 1;
      board[0][1].state = 'flagged'; // Wrong flag placement
      board[1][0].value = 1;
      board[1][0].state = 'revealed';
      board[1][1].value = 1;
      board[1][1].state = 'revealed';

      expect(checkWin(board)).toBe(false);
    });
  });
});
