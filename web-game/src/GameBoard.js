import React, { useState } from 'react';
import { isValidPlacement } from './utils';
import './App.css';


const GameBoard = ({grid, onTurn, turnNumber}) => {
    const [hoverPosition, setHoverPosition] = useState(null);
    const [currentStart, setCurrentStart] = useState(null);
    
    const onClickCell = (row, col) => {
        if(currentStart === null) {
            placePieceStart(row, col);
        } else {
            placePieceEnd(row, col);
        }
    }
    
    // Function to handle first click of piece placement
    const placePieceStart = (row, col) => {
        // set current start
        if (grid[row][col] !== null) {
            alert("Invalid placement! Start must be an empty cell");
            return;
        }
        setCurrentStart({row, col});
    };
    
    const placePieceEnd = (row, col) => {
        const inducedRectangle = [Math.min(currentStart.row, row), 
                                  Math.min(currentStart.col, col),
                                  Math.max(currentStart.row, row), 
                                  Math.max(currentStart.col, col)];
                                  
        
                                  
        if (!isValidPlacement(grid, inducedRectangle[0], inducedRectangle[1], inducedRectangle[2], inducedRectangle[3], turnNumber)) {
            alert(`Invalid placement! Rectangle should not have overlaps and have area ${turnNumber} or ${turnNumber + 1}`);
            setCurrentStart(null);
            setHoverPosition(null);
            return;
        }
        
        const topLeft = {row: inducedRectangle[0], col: inducedRectangle[1]};
        const bottomRight = {row: inducedRectangle[2], col: inducedRectangle[3]};
        onTurn({topLeft, bottomRight});

        
        setCurrentStart(null);    
    };
    
    const isCellInRectangle = (row, col) => {
        if (!currentStart || !hoverPosition) return false;
    
        const rowStart = Math.min(currentStart.row, hoverPosition.row);
        const rowEnd = Math.max(currentStart.row, hoverPosition.row);
        const colStart = Math.min(currentStart.col, hoverPosition.col);
        const colEnd = Math.max(currentStart.col, hoverPosition.col);
    
        return row >= rowStart && row <= rowEnd && col >= colStart && col <= colEnd;
    };

    // Function to generate a color based on turn number
    const getColorForTurn = (turn) => {
        const hue = (turn * 137) % 360; // Using a simple formula to vary hue
        return `hsl(${hue}, 70%, 60%)`; // Adjust saturation and lightness as needed
    };
   
    const isStart = (row, col, current) => {
        return current && current.row === row && current.col === col;
    }
    
    const handleMouseLeave = () => {
        setHoverPosition(null);
    };
    
    const handleCellHover = (row, col) => {
        if (currentStart) {
            setHoverPosition({ row, col });
            console.log(`Hovering over cell (${row}, ${col})`);
        }
    };

    // Render the game board
    return (
        <div className="game-board">
            {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((cell, colIndex) => (
                        <Cell key={colIndex}
                            className={`cell ${cell === null ? 'empty-cell' : ''} ${isCellInRectangle(rowIndex, colIndex) ? 'highlight-rectangle' : ''} ${isStart(rowIndex, colIndex, currentStart) ? 'startCell' : ''}`}
                            onClick={() => onClickCell(rowIndex, colIndex)}
                            onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
                            onMouseLeave={handleMouseLeave}
                            style={{ backgroundColor:  cell ? getColorForTurn(cell) : 'transparent' }}
                            gridSize={grid.length}
                            >
                            {cell}
                        </Cell>
                    ))}
                </div>
            ))}
           
        </div>
    );
};

function Cell(props) {
    const cellSize = 400 / props.gridSize;
    const cellStyle = {...props.style, height: cellSize, width: cellSize};
    return (
        <div className={props.className} onClick={props.onClick} onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave} style={cellStyle}>
            {props.children}
        </div>
    );
};

export default GameBoard;