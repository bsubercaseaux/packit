import React, { useState } from 'react';
import './App.css';


const Game = () => {
    const [grid, setGrid] = useState(Array(5).fill(Array(5).fill(null)));
    const [gridSize, setGridSize] = useState(5);
    const [currentTurn, setCurrentTurn] = useState(1);
    const [winner, setWinner] = useState(null);
    const [currentStart, setCurrentStart] = useState(null);
    const [hoverPosition, setHoverPosition] = useState(null);
    
    // Function to handle piece placement
    const placePieceStart = (row, col, turn) => {
        // set current start
        if (grid[row][col] !== null) {
            alert("Invalid placement! Start must be an empty cell");
            return;
        }
        setCurrentStart({row, col});
    };
    
    const handleCellHover = (row, col) => {
        if (currentStart) {
            setHoverPosition({ row, col });
            console.log(`Hovering over cell (${row}, ${col})`);
        }
    };
    
    const intersect = (rect1, rect2) => {
        for(let i = rect1[0]; i <= rect1[2]; i++) {
            for(let j = rect1[1]; j <= rect1[3]; j++) {
                if(i >= rect2[0] && i <= rect2[2] && j >= rect2[1] && j <= rect2[3]) return true;
            }
        }
        return false;
    }
    
    const placePieceEnd = (row, col, turn) => {
        const inducedRectangle = [Math.min(currentStart.row, row), 
                                  Math.min(currentStart.col, col),
                                  Math.max(currentStart.row, row), 
                                  Math.max(currentStart.col, col)];
                                  
        if (!canPlacePiece(inducedRectangle[0], inducedRectangle[1], inducedRectangle[2], inducedRectangle[3], turn)) {
            alert(`Invalid placement! Rectangle should have area ${turn} or ${turn + 1}`);
            setCurrentStart(null);
            setHoverPosition(null);
            return;
        }
    
        setGrid(grid => grid.map((rowArray, rowIndex) => {
            if (rowIndex > inducedRectangle[2] || rowIndex < inducedRectangle[0]) return rowArray;
            return rowArray.map((cell, colIndex) => {
                if (colIndex > inducedRectangle[3] || colIndex < inducedRectangle[1]) return cell;
                return turn;
            });
        }));  
        
        setCurrentStart(null);
        
        // check winner
        let canContinue = false;
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid.length; j++) {
                for(let a = i; a < grid.length; a++) {
                    for(let b = j; b < grid.length; b++) {
                        if(canPlacePiece(i, j, a, b, turn + 1) && !intersect(inducedRectangle, [i, j, a, b])) {
                            canContinue = [i, j, a, b];
                            break;
                        }
                    }
                
                }
            }
        }
        
        console.log(canContinue);
        if(!canContinue) {
            setWinner(turn % 2 ? 'Player 1' : 'Player 2');
            console.log('Game over!');
        }
        setCurrentTurn(turn + 1);
                
    };
    
    const canPlacePiece = (row, col, row2, col2, turn) => {
        const area = (row2 - row + 1) * (col2 - col + 1);
        if ((area !== turn) && (area !== turn + 1)) return false;
        
        // now check that it doesn't intersect with any other pieces
        for(let i = row; i <= row2; i++) {
            for(let j = col; j <= col2; j++) {
                if(grid[i][j] !== null) return false;
            }
        }
        return true;
    
    }
    
    
    const onClickCell = (row, col, turn) => {
        if(currentStart === null) {
            placePieceStart(row, col, turn);
        } else {
            placePieceEnd(row, col, turn);
        }
    }
    
    const handleMouseLeave = () => {
        setHoverPosition(null);
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

    const resetGrid = (size) => {
        let s = parseInt(size);
        console.log(s);
        setCurrentTurn(1);
        setCurrentStart(null);
        setWinner(null);
        setHoverPosition(null);
        setGrid(Array(s).fill(Array(s).fill(null)));
    }
    
    const isStart = (row, col, current) => {
        return current && current.row === row && current.col === col;
    }

    // Render the game board
    return (
        
        <div className="game-board">
            {winner && <p style={{marginTop: 5, marginBottom: 2}}> <b>Winner:</b> {winner} 🎊</p> }
            {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((cell, colIndex) => (
                        <Cell key={colIndex}
                            className={`cell ${cell === null ? 'empty-cell' : ''} ${isCellInRectangle(rowIndex, colIndex) ? 'highlight-rectangle' : ''} ${isStart(rowIndex, colIndex, currentStart) ? 'startCell' : ''}`}
                            onClick={() => onClickCell(rowIndex, colIndex, currentTurn)}
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
            <p> <b>Current Turn:</b> {currentTurn} ({currentTurn % 2 ? 'Player 1' : 'Player 2'})</p>
            
            <div style={{display: 'flex', flexDirection: 'row', marginBottom: 10}}>
                <p style={{margin: 0, marginRight: 8}}> board dimension  </p>
                <input className="dimInput" type="number" value={gridSize} onChange={(e) => {
                setGridSize(e.target.value)}} />
                <button className="resetBtn" style={{marginLeft: 10}} onClick={() => resetGrid(gridSize)}> Reset </button>
            </div>
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
}

export default Game;
