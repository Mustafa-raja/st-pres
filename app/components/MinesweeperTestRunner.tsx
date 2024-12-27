import React, { useState, useEffect } from 'react';
import MinesweeperBoard from './MinesweeperBoard';
import { createBoard, revealCell, toggleFlag, checkWin, type Cell } from '../../src/lib/minesweeper';

const MinesweeperTestRunner: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [testMessage, setTestMessage] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 7;

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runVisualTest = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    
    // Create a 5x5 board with 3 mines at fixed positions
    const initialBoard = createBoard(5, 5, 0);
    
    // Manually place mines for predictable testing
    const minePositions = [[1, 1], [3, 2], [4, 4]];
    minePositions.forEach(([y, x]) => {
      initialBoard[y][x].value = 'mine';
    });

    // Update numbers around mines
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        if (initialBoard[y][x].value !== 'mine') {
          let count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (
                ny >= 0 && ny < 5 &&
                nx >= 0 && nx < 5 &&
                initialBoard[ny][nx].value === 'mine'
              ) {
                count++;
              }
            }
          }
          initialBoard[y][x].value = count;
        }
      }
    }

    setBoard(initialBoard);
    setTestMessage('🎲 Initial board created');
    setCurrentStep(1);
    await sleep(2000);

    // Test Step 1: Reveal a safe cell
    let gameBoard = revealCell(initialBoard, 0, 0);
    setBoard(gameBoard);
    setTestMessage('🔍 Test 1: Revealing cell (0,0) - Should be safe');
    setCurrentStep(2);
    await sleep(2000);

    // Test Step 2: Flag a suspected mine
    gameBoard = toggleFlag(gameBoard, 1, 1);
    setBoard(gameBoard);
    setTestMessage('🚩 Test 2: Flagging suspected mine at (1,1)');
    setCurrentStep(3);
    await sleep(2000);

    // Test Step 3: Reveal another safe area
    gameBoard = revealCell(gameBoard, 0, 4);
    setBoard(gameBoard);
    setTestMessage('🔍 Test 3: Revealing cell (4,0) - Should reveal multiple safe cells');
    setCurrentStep(4);
    await sleep(2000);

    // Test Step 4: Flag another mine
    console.log('Before Test 4 - Board State:', JSON.stringify(gameBoard));
    console.log('Attempting to flag position (3,2)');
    gameBoard = toggleFlag(gameBoard, 2, 3);
    console.log('After Test 4 - Board State:', JSON.stringify(gameBoard));
    console.log('Cell state at (3,2):', gameBoard[3][2].state);
    setBoard(gameBoard);
    setTestMessage('🚩 Test 4: Flagging second mine at (3,2)');
    setCurrentStep(5);
    await sleep(2000);

    // Test Step 5: Flag the last mine
    gameBoard = toggleFlag(gameBoard, 4, 4);
    setBoard(gameBoard);
    setTestMessage('🚩 Test 5: Flagging last mine at (4,4)');
    setCurrentStep(6);
    await sleep(2000);

    // Test Step 6: Reveal remaining safe cells
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        if (gameBoard[y][x].state === 'hidden') {
          gameBoard = revealCell(gameBoard, x, y);
        }
      }
    }
    setBoard(gameBoard);
    setTestMessage('🔍 Test 6: Revealing remaining safe cells');
    setCurrentStep(7);
    await sleep(2000);

    // Check win condition
    const hasWon = checkWin(gameBoard);
    setTestMessage(hasWon ? '🎉 All Tests Passed! Game Won! 🎉' : '❌ Tests Failed: Game Not Won');
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="w-full max-w-2xl space-y-4">
        <div className="border border-gray-200 rounded-lg bg-white p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Visual Test Runner
            </h2>
            <div className="flex justify-center">
              <button
                onClick={runVisualTest}
                disabled={isRunning}
                className={`
                  px-4 py-2 text-sm font-medium rounded-md border
                  ${isRunning 
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                {isRunning ? '🔄 Tests Running...' : '▶️ Run Visual Tests'}
              </button>
            </div>
            
            {isRunning && (
              <div className="w-full">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                  <div 
                    className="h-full bg-gray-900 transition-all duration-500"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-500 text-center">
                  Step {currentStep} of {totalSteps}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {board.length > 0 && (
        <div className="transition-opacity duration-200">
          <MinesweeperBoard
            board={board}
            isTestMode={true}
            testMessage={testMessage}
          />
        </div>
      )}
    </div>
  );
};

export default MinesweeperTestRunner;
