import React, { useEffect, useState } from 'react';
import './App.css';
import GameBoard from './GameBoard';
import { intersect, isValidPlacement } from './utils';


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
                            // console log each move and try to figure out what's happening
                            // look at evaluation function to see if there is a mistake
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


function evaluateGameState(gameState, maximizingPlayer, currentTurn, startingPlayer) {
    let AIPlayer = !maximizingPlayer; 
    let evaluation = 0;
    if (gameState.isGameOver()) {
        if (maximizingPlayer) {
            return -1000000000;
        }
        else {
            return 1000000000;
        }

    } else {
        return 0;

    }


   



    



    /*

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
     */
}


// Minimax algorithm 
function minimax(gameState, depth, maximizingPlayer, startingPlayer) {
    if (depth === 0 || gameState.isGameOver()) {
        return evaluateGameState(gameState, maximizingPlayer, gameState.turn, startingPlayer);
    }

    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of gameState.legalMoves(gameState.turn)) {
            gameState.makeMove(move);
            const evaluation = minimax(gameState, depth - 1, false, startingPlayer);
            gameState.undoMove(move);
            maxEval = Math.max(maxEval, evaluation);
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of gameState.legalMoves(gameState.turn)) {
            gameState.makeMove(move);
            const evaluation = minimax(gameState, depth - 1, true, startingPlayer);
            gameState.undoMove(move);
            minEval = Math.min(minEval, evaluation);
        }
        return minEval;
    }
}


function getAIMove(gameState, depth, startingPlayer) {
    let bestMove = null;
    let bestEval = -Infinity;
    let turn = gameState.turn;
    let array_test = gameState.legalMoves(turn);
    console.log(array_test);
    for (const move of gameState.legalMoves(turn)) { // AI is minimizing evaluation
        gameState.makeMove(move);
        const evaluation = minimax(gameState, depth - 1, false, startingPlayer);
        gameState.undoMove(move);
        if (evaluation > bestEval) { 
            bestEval = evaluation; 
            bestMove = move;
        }
    }
    console.log("Best move is", bestMove);
    return bestMove;
}

const AIGame = ({startingPlayer}) => {
    const [grid, setGrid] = useState(Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => null)));
    const [gridSize, setGridSize] = useState(5);
    const [aiDepth, setAIDepth] = useState(3);
    const [currentTurn, setCurrentTurn] = useState(1);
    const [winner, setWinner] = useState(null);
    const [humanStart, setHumanStart] = useState(null);
    console.log("starting player:", startingPlayer);
    
    useEffect(() => {
        async function executeTurn() {
            console.log("starting player:", startingPlayer);
            if(startingPlayer === null) {
                return;
            }
            const startIndex = startingPlayer === 'human' ? 1 : 0;
            console.log("starting index:", startIndex);
            if(currentTurn % 2 == startIndex) {
                console.log("Human turn!");
            } else {
                console.log("AI turn!");
                await new Promise(r => setTimeout(r, 750));
                AIMove();
            }
        }
        executeTurn();
    })
    
    useEffect(() => {
        console.log("starting player:", startingPlayer);
    }, [startingPlayer]);
    
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
        onTurn(move);
        // console.log("AI Move before");
        await new Promise(r => setTimeout(r, 1000));
        // AIMove();
        // console.log("AI Move after");        
    }
    
    const AIMove = async () => {
        console.log("AI turn!, current turn =", currentTurn );
        if (currentTurn === 1) {
            setHumanStart(false);
        }
        let newGameState = new GameState(grid, currentTurn);
        let aiMove = getAIMove(newGameState, aiDepth, startingPlayer);
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

    const onTurn = (move) => {
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
        // await new Promise(r => setTimeout(r, 500));
        // console.log("250: current turn:", currentTurn);
    }
    
    // speed it up: benchmark it (record how long it takes on sheets - get up to grid 20, try different depths too)
    // fix algorithm? tbd ...
    


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
                </button>  */}
            </div>
        </div>
    );
};

export default AIGame;
