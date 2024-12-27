export type CellValue = number | 'mine'
export type CellState = 'hidden' | 'revealed' | 'flagged'

export interface Cell {
  value: CellValue
  state: CellState
}

export interface GameState {
  board: Cell[][]
  gameOver: boolean
  won: boolean
}

export const createBoard = (width: number, height: number, mineCount: number): Cell[][] => {
  // Initialize empty board
  const board: Cell[][] = Array(height).fill(null).map(() =>
    Array(width).fill(null).map(() => ({
      value: 0,
      state: 'hidden'
    }))
  )

  // Place mines randomly
  let minesToPlace = mineCount
  while (minesToPlace > 0) {
    const x = Math.floor(Math.random() * width)
    const y = Math.floor(Math.random() * height)
    
    if (board[y][x].value !== 'mine') {
      board[y][x].value = 'mine'
      minesToPlace--
      
      // Update adjacent cell numbers
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy
          const nx = x + dx
          if (
            ny >= 0 && ny < height &&
            nx >= 0 && nx < width &&
            board[ny][nx].value !== 'mine'
          ) {
            board[ny][nx].value = (board[ny][nx].value as number) + 1
          }
        }
      }
    }
  }

  return board
}

export const revealCell = (board: Cell[][], x: number, y: number): Cell[][] => {
  // Check bounds and if cell is already revealed or flagged
  if (
    x < 0 || x >= board[0].length ||
    y < 0 || y >= board.length ||
    board[y][x].state === 'revealed' ||
    board[y][x].state === 'flagged'
  ) {
    return board;
  }

  // Create a new board with deep copy
  const newBoard = JSON.parse(JSON.stringify(board));
  
  // Reveal the current cell
  newBoard[y][x].state = 'revealed';

  // If it's an empty cell, reveal adjacent cells recursively
  if (newBoard[y][x].value === 0) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const ny = y + dy;
        const nx = x + dx;
        if (
          nx >= 0 && nx < newBoard[0].length &&
          ny >= 0 && ny < newBoard.length &&
          newBoard[ny][nx].state === 'hidden'
        ) {
          // Recursively reveal adjacent cells
          const recursiveBoard = revealCell(newBoard, nx, ny);
          // Copy revealed states back to our board
          for (let i = 0; i < recursiveBoard.length; i++) {
            for (let j = 0; j < recursiveBoard[0].length; j++) {
              newBoard[i][j].state = recursiveBoard[i][j].state;
            }
          }
        }
      }
    }
  }

  return newBoard;
}

export const toggleFlag = (board: Cell[][], x: number, y: number): Cell[][] => {
  if (board[y][x].state === 'revealed') return board;

  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  newBoard[y][x].state = newBoard[y][x].state === 'flagged' ? 'hidden' : 'flagged';
  return newBoard;
}

export const checkWin = (board: Cell[][]): boolean => {
  return board.every(row =>
    row.every(cell =>
      (cell.value === 'mine' && cell.state === 'flagged') ||
      (cell.value !== 'mine' && cell.state === 'revealed')
    )
  );
}
