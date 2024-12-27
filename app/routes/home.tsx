import React from 'react';
import MinesweeperTestRunner from '../components/MinesweeperTestRunner';

export function meta() {
  return [
    { title: "Vitest Minesweeper Demo" },
    { description: "Visual Testing Demo with Vitest and Minesweeper" }
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-gray-900">
                Visual Testing with Vitest
              </h1>
              <h2 className="text-xl text-gray-600">
                Minesweeper Demo
              </h2>
            </div>
            <p className="text-gray-600 border-l-2 border-gray-200 pl-4">
              Watch as we demonstrate test-driven development through an interactive
              Minesweeper game. Each test case visually shows different aspects of the game logic.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg bg-white p-6">
            <MinesweeperTestRunner />
          </div>

          <div className="text-sm text-gray-500 border-t border-gray-200 pt-4">
            Built with React, TypeScript, and Vitest
          </div>
        </div>
      </div>
    </div>
  );
}
