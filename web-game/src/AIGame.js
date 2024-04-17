import React, { useEffect, useState } from 'react';
import './App.css';
import GameBoard from './GameBoard';
import { intersect, isValidPlacement } from './utils';
// import { intersect, isValidPlacement, getComputerMove } from './utils';


class GameState {
    constructor(board = [], turn = 1) {
        this.board = board;
        this.turn = turn;
    }

    // Check if the game is over

    isGameOver() {
        return this.legalMoves(this.turn).length === 0;
    }

    // Get all legal moves for a given player
    legalMoves(turn) {
        const moves = [];
       // console.log("turn:", turn, "board:", this.board);
        
        for (let rowStart = 0; rowStart < this.board.length; rowStart++) {
            for (let colStart = 0; colStart < this.board[0].length; colStart++) {
                for (let rowEnd = rowStart; rowEnd < this.board.length; rowEnd++) {
                    for (let colEnd = colStart; colEnd < this.board[0].length; colEnd++) {
                        if (isValidPlacement(this.board, rowStart, colStart, rowEnd, colEnd, turn) ) {
                            moves.push({topLeft:{row:rowStart, col: colStart}, bottomRight:{row: rowEnd, col: colEnd}});
                        }
                    }
                } 
            }
        }
        return moves;
    }

    // Make a move on the board
    makeMove(move) {
        const row1 = move.topLeft.row;
        const col1 = move.topLeft.col;
        const row2 = move.bottomRight.row;
        const col2 = move.bottomRight.col;
        for (let r = row1; r <= row2; r++) {
            for (let c = col1; c <= col2; c++) {
                this.board[r][c] = this.turn;
            }
        }
        this.turn = this.turn + 1;
    }

    // Undo the last move
    undoMove(move) {
        const row1 = move.topLeft.row;
        const col1 = move.topLeft.col;
        const row2 = move.bottomRight.row;
        const col2 = move.bottomRight.col;
        for (let r = row1; r <= row2; r++) {
            for (let c = col1; c <= col2; c++) {
                this.board[r][c] = null;
            }
        }
        this.turn = this.turn - 1;
    }
}


function evaluateBoard(board) {
    let evaluation = 0;

    
    let tilesCount = 0; // note for myself: counting number of tiles placed
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] !== 0) {
                tilesCount++;
            }
        }
    }

    
    let areaCovered = 0; // note for myself: calculating the area covered by the tiles
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] !== 0) {
                areaCovered++;
            }
        }
    }

    evaluation = tilesCount + areaCovered;

    return evaluation;
}


// Minimax algorithm 
function minimax(gameState, depth, maximizingPlayer) {
    if (depth === 0 || gameState.isGameOver()) {
        return evaluateBoard(gameState.board);
    }

    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of gameState.legalMoves(gameState.turn)) {
            gameState.makeMove(move);
            const evaluation = minimax(gameState, depth - 1, false);
            gameState.undoMove(move);
            maxEval = Math.max(maxEval, evaluation);
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of gameState.legalMoves(gameState.turn)) {
            gameState.makeMove(move);
            const evaluation = minimax(gameState, depth - 1, true);
            gameState.undoMove(move);
            minEval = Math.min(minEval, evaluation);
        }
        return minEval;
    }
}


function getAIMove(gameState, depth) {
    let bestMove = null;
    let bestEval = -Infinity;
    let turn = gameState.turn;
    let array_test = gameState.legalMoves(turn);
    console.log(array_test);
    for (const move of gameState.legalMoves(turn)) {
        gameState.makeMove(move);
        const evaluation = minimax(gameState, depth - 1, false);
        gameState.undoMove(move);
        if (evaluation > bestEval) {
            bestEval = evaluation; 
            bestMove = move;
        }
    }
    console.log("Best move is", bestMove);
    return bestMove;
}


// Example usage:

// const initialState = new GameState(Array.from({ length: 5 }, () => Array(5).fill(0)), 1);
// const aiDepth = 3; // Depth of minimax algorithm
// const aiMove = getAIMove(initialState, aiDepth);
// console.log("AI Move:", aiMove);




const AIGame = () => {
    const [grid, setGrid] = useState(Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => null)));
    const [gridSize, setGridSize] = useState(5);
    const [aiDepth, setAIDepth] = useState(3);
    const [currentTurn, setCurrentTurn] = useState(1);
    const [winner, setWinner] = useState(null);
    const [solitaireMode, setSolitaireMode] = useState(false); 
    const [humanStart, setHumanStart] = useState(null);
    
    const resetGame = (size) => {
        console.log('resetting game with size', size);
        setCurrentTurn(1);
        setWinner(null);
        
        let newGrid = Array(parseInt(size)).fill(Array(parseInt(size)).fill(null));
        console.log(newGrid);
        setGrid(newGrid);
    }

    const onPlayerTurn = async (move) => {
        console.log("Player turn!");
        if (currentTurn === 1) {
            setHumanStart(true);

        }
        if (!solitaireMode) {
            await onTurn(move);
            console.log("AI Move before");
            await new Promise(r => setTimeout(r, 5000));
            await AIMove();
            console.log("AI Move after");
        }
        
    }
    
    const AIMove = async () => {
        if (currentTurn === 1) {
            setHumanStart(false);
        }
        let newGameState = new GameState(grid, currentTurn);
        let aiMove = getAIMove(newGameState, aiDepth);
        console.log("Line: 178, aiMove =", aiMove);
        onTurn(aiMove);
        
    }
    
    function sample(array) {
        return array[Math.floor(Math.random() * array.length)];
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
    /*
    const onTurn = (move) => {
        if (!move) {
            // Handle the case where the move is null
            console.log("No valid move found for AI player.");
            return;
        }
    
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
            
        const inducedRectangle = [topLeft.row, topLeft.col, bottomRight.row, bottomRight.col];
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
            // currentTurn is odd <—> last move was done by the same who started
            if (humanStart  === true) {
                setWinner(currentTurn % 2 ? 'Player': 'AI');
            } else {
                setWinner(currentTurn % 2 ? 'AI': 'Player');
            }
            console.log('Game over!');
        }

        
        setCurrentTurn(currentTurn + 1);  
    };
    */

    const onTurn = async (move) => {
        console.log("Turn number:", currentTurn);
        if (!move) {
            // Handle the case where the move is null
            console.log("No valid move found for AI player.");
            return;
        }
    
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
            
        const inducedRectangle = [topLeft.row, topLeft.col, bottomRight.row, bottomRight.col];
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
            // currentTurn is odd <—> last move was done by the same who started
            if (humanStart  === true) {
                setWinner(currentTurn % 2 ? 'Player': 'AI');
            } else {
                setWinner(currentTurn % 2 ? 'AI': 'Player');
            }
            console.log('Game over!');
        }
        console.log("current turn:", currentTurn);
        setCurrentTurn(currentTurn + 1);
        await new Promise(r => setTimeout(r, 500));
        console.log("current turn:", currentTurn);
        console.log("On Turn worked");
    }
    



    // speed it up: benchmark it (record how long it takes on sheets - get up to grid 20, try different depths too)
    // fix algorithm? tbd ...
    // modal asking us on who they want to start, get rid of AImove, end of human turn tiggers the AI to move again
       // minimax with alpha, beta, pruning: branches where you abandon them b/c they're too stupid to try, too good = avoid exploring the rest
          // already explored a branch, best evaluation is 20 vs other ones wont be better than 10, no point in exploring other branches
          // 
    
    

    // Render the game board
    return (
        <div>
            {winner && <p style={{ marginTop: 5, marginBottom: 2 }}> <b>Winner:</b> {winner} 🎊</p>}
            <GameBoard
                grid={grid}
                onTurn={onPlayerTurn}
                turnNumber={currentTurn}
            />
            <p> <b>Current Turn:</b> {currentTurn} </p>
            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 10 }}>
                <p style={{ margin: 0, marginRight: 8 }}> board dimension  </p>
                <input className="dimInput" type="number" value={gridSize} onChange={(e) => {
                    console.log(e.target.value);
                    setGridSize(e.target.value)
                }} />
                <button className="resetBtn" style={{ marginLeft: 10 }} onClick={() => resetGame(gridSize)}>
                    Reset
                </button>
                {/* <button className="" style={{ marginLeft: 10 }} onClick={() => AIMove()}>
                    AIMove
                </button> */}
            </div>
            Print board
        </div>
    );
};

export default AIGame;
