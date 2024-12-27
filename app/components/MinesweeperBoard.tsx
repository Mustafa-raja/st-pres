import React from 'react';
import type { Cell } from '../../src/lib/minesweeper';

interface MinesweeperBoardProps {
  board: Cell[][];
  onCellClick?: (x: number, y: number) => void;
  onCellRightClick?: (x: number, y: number) => void;
  isTestMode?: boolean;
  testMessage?: string;
}

const MinesweeperBoard: React.FC<MinesweeperBoardProps> = ({
  board,
  onCellClick,
  onCellRightClick,
  isTestMode,
  testMessage
}) => {
  const getCellContent = (cell: Cell) => {
    if (cell.state === 'hidden') return '';
    if (cell.state === 'flagged') return '🚩';
    if (cell.value === 'mine') return '💣';
    return cell.value === 0 ? '' : cell.value;
  };

  const getCellClass = (cell: Cell) => {
    let className = 'w-12 h-12 flex items-center justify-center font-medium text-xl transition-colors border ';
    
    if (cell.state === 'hidden') {
      className += 'bg-white hover:bg-gray-50 border-gray-200 cursor-pointer';
    } else if (cell.state === 'revealed') {
      className += 'bg-gray-50 border-gray-200 ';
      if (typeof cell.value === 'number') {
        switch (cell.value) {
          case 1: className += 'text-blue-600'; break;
          case 2: className += 'text-green-600'; break;
          case 3: className += 'text-red-600'; break;
          case 4: className += 'text-purple-600'; break;
          default: className += 'text-gray-800';
        }
      }
    }
    
    return className;
  };

  const handleContextMenu = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    onCellRightClick?.(x, y);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {isTestMode && testMessage && (
        <div className="text-sm font-medium py-2 px-4 bg-white border border-gray-200 text-gray-900 rounded-md">
          {testMessage}
        </div>
      )}
      <div className="border border-gray-200 rounded-lg bg-white p-4">
        <div className="grid gap-[1px] bg-gray-200 rounded-md overflow-hidden">
          {board.map((row, y) => (
            <div key={y} className="flex gap-[1px]">
              {row.map((cell, x) => (
                <button
                  key={`${x}-${y}`}
                  className={getCellClass(cell)}
                  onClick={() => onCellClick?.(x, y)}
                  onContextMenu={(e) => handleContextMenu(e, x, y)}
                  disabled={cell.state === 'revealed'}
                >
                  {getCellContent(cell)}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinesweeperBoard;
