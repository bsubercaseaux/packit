import React, { useEffect, useState } from 'react';
import './App.css';
import GameBoard from './GameBoard';
import { intersect, isValidPlacement } from './utils';


const Game = ({ broadcastMove, lastOpponentTurn }) => {
    const [grid, setGrid] = useState(Array(5).fill(Array(5).fill(null)));
    const [gridSize, setGridSize] = useState(5);
    const [currentTurn, setCurrentTurn] = useState(1);
    const [winner, setWinner] = useState(null);
    const [playerIndex, setPlayerIndex] = useState(null);
    
    useEffect(() => {
        if(lastOpponentTurn) {
            onOpponentTurn(lastOpponentTurn);
        }
        // eslint-disable-next-line
    }, [lastOpponentTurn]);

    const resetGame = (size) => {
        setCurrentTurn(1);
        setWinner(null);
        setGrid(Array(size).fill(Array(size).fill(null)));
    }

    const onOpponentTurn = (move) => {
        if(playerIndex === null) {
            setPlayerIndex(2);
        }
        onTurn(move);
    }
    
    const onPlayerTurn = (move) => {
        if(playerIndex === null) {
            setPlayerIndex(1);
        }
        else if((currentTurn-1) % 2 !== (playerIndex-1)) return;
        onTurn(move);
        broadcastMove(move);
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
                    setGridSize(e.target.value)
                }} />
                <button className="resetBtn" style={{ marginLeft: 10 }} onClick={() => resetGame(gridSize)}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Game;
