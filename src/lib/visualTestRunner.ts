import { Cell } from './minesweeper'

export const visualizeBoard = (board: Cell[][]): string => {
  const header = '  ' + Array.from({ length: board[0].length }, (_, i) => i).join(' ')
  const separator = '  ' + '─'.repeat(board[0].length * 2 - 1)
  
  const rows = board.map((row, i) => {
    const cells = row.map(cell => {
      if (cell.state === 'hidden') return '□'
      if (cell.state === 'flagged') return '⚑'
      if (cell.value === 'mine') return '💣'
      return cell.value.toString()
    }).join(' ')
    return `${i}|${cells}`
  })

  return `\n${header}\n${separator}\n${rows.join('\n')}\n`
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const logStep = async (message: string, board: Cell[][]): Promise<void> => {
  console.log(`\n🎮 ${message}`)
  console.log(visualizeBoard(board))
  await sleep(1000) // Pause between steps for visibility
}
