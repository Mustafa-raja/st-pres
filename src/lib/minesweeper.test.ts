import { describe, it, expect } from 'vitest'
import { createBoard, revealCell, toggleFlag, checkWin, type Cell } from './minesweeper'
import { logStep } from './visualTestRunner'

describe('🎮 Minesweeper Visual Game Test', () => {
  it('should demonstrate a complete game scenario', async () => {
    // Create a 5x5 board with 3 mines at fixed positions
    const board = createBoard(5, 5, 0) // Start with no mines
    
    // Manually place mines for predictable testing
    const minePositions = [[1, 1], [3, 2], [4, 4]]
    minePositions.forEach(([y, x]) => {
      board[y][x].value = 'mine'
    })

    // Update numbers around mines
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        if (board[y][x].value !== 'mine') {
          let count = 0
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = y + dy
              const nx = x + dx
              if (
                ny >= 0 && ny < 5 &&
                nx >= 0 && nx < 5 &&
                board[ny][nx].value === 'mine'
              ) {
                count++
              }
            }
          }
          board[y][x].value = count
        }
      }
    }

    try {
      // Step 1: Reveal a safe cell
      let gameBoard = revealCell(board, 0, 0)
      await logStep('Revealing cell (0,0) - Should be safe', gameBoard)
      expect(gameBoard[0][0].state).toBe('revealed')

      // Step 2: Flag all mines
      for (const [y, x] of minePositions) {
        gameBoard = toggleFlag(gameBoard, x, y)
        await logStep(`Flagging mine at (${y},${x})`, gameBoard)
        expect(gameBoard[y][x].state).toBe('flagged')
      }

      // Step 3: Reveal all safe cells
      const safeCells = []
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          if (gameBoard[y][x].value !== 'mine' && gameBoard[y][x].state === 'hidden') {
            safeCells.push([y, x])
          }
        }
      }

      for (const [y, x] of safeCells) {
        gameBoard = revealCell(gameBoard, x, y)
        await logStep(`Revealing safe cell at (${y},${x})`, gameBoard)
      }

      // Check win condition
      const hasWon = checkWin(gameBoard)
      await logStep(hasWon ? '🎉 Game Won!' : '😢 Game Not Won Yet', gameBoard)
      expect(hasWon).toBe(true)
    } catch (error) {
      console.error('Test failed:', error)
      throw error
    }
  }, { timeout: 30000 })
})
