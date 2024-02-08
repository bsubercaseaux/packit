import React, { useEffect, useState } from 'react';
import './App.css';
import GameBoard from './GameBoard';
import { intersect, isValidPlacement } from './utils';


const LocalGame = () => {
    const [grid, setGrid] = useState(Array(5).fill(Array(5).fill(null)));
    const [gridSize, setGridSize] = useState(5);
    const [currentTurn, setCurrentTurn] = useState(1);
    const [winner, setWinner] = useState(null);
    
    const resetGame = (size) => {
        console.log('resetting game with size', size);
        setCurrentTurn(1);
        setWinner(null);
        
        let newGrid = Array(parseInt(size)).fill(Array(parseInt(size)).fill(null));
        console.log(newGrid);
        setGrid(newGrid);
    }
   
    const onPlayerTurn = (move) => {
        onTurn(move);
    }
    
    const printBoard = () => {
        let st = "";
        for (let i = 0; i < grid.length; i++) {
            
            for(let j = 0; j < grid.length; j++) {
                st += (grid[i][j] ? grid[i][j] : '-') + " ";
            }
            st += "\n";
        }
        console.log(st);
    }
    

    // top-left and bottom-right corners of the rectangle
    const onTurn = (move) => {
        const { topLeft, bottomRight } = move;
        
        if (!isValidPlacement(grid, topLeft.row, topLeft.col, bottomRight.row, bottomRight.col, currentTurn)) {
            return; // no-op
        }
        
        
        setGrid(grid => grid.map((rowArray, rowIndex) => {
            return rowArray.map((cell, colIndex) => {
                if (rowIndex >= topLeft.row && rowIndex <= bottomRight.row && colIndex >= topLeft.col && colIndex <= bottomRight.col) {
                    return currentTurn;
                } else {
                    return cell;
                }
            });
        }));
        
        const inducedRectangle = [topLeft.row, topLeft.col, bottomRight.row, bottomRight.col]
        // check winner
        let canContinue = false;
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid.length; j++) {
                for(let a = i; a < grid.length; a++) {
                    for(let b = j; b < grid.length; b++) {
                        if(isValidPlacement(grid, i, j, a, b, currentTurn + 1) && !intersect(inducedRectangle, [i, j, a, b])) {
                            canContinue = [i, j, a, b];
                            break;
                        }
                    }
                
                }
            }
        }
        
        if(!canContinue) {
            setWinner(currentTurn % 2 ? 'Player 1' : 'Player 2');
            console.log('Game over!');
        }
        setCurrentTurn(currentTurn + 1);      
    }
    
    

    // Render the game board
    return (
        <div>
            {winner && <p style={{ marginTop: 5, marginBottom: 2 }}> <b>Winner:</b> {winner} 🎊</p>}
            <GameBoard
                grid={grid}
                onTurn={onPlayerTurn}
                turnNumber={currentTurn}
            />
            <p> <b>Current Turn:</b> {currentTurn} ({currentTurn % 2 ? 'Player 1' : 'Player 2'})</p>
            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 10 }}>
                <p style={{ margin: 0, marginRight: 8 }}> board dimension  </p>
                <input className="dimInput" type="number" value={gridSize} onChange={(e) => {
                    console.log(e.target.value);
                    setGridSize(e.target.value)
                }} />
                <button className="resetBtn" style={{ marginLeft: 10 }} onClick={() => resetGame(gridSize)}>
                    Reset
                </button>
            </div>
            
            <button  style={{ marginLeft: 10 }} onClick={() => printBoard()}>
                    Print board
            </button>
        </div>
    );
};

export default LocalGame;
