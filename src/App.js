import { useState } from "react";

/**
 * Defining the winning "lines" in the game of tic-tac-toe
 */
const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];


/**
 * Returns a square on the tic-tac-toe board.
 * 
 * @param {string|null} value - value of the square which is either "X", "O", or empty (null) 
 * @returns {JSX element} button - the JSX button for a particular square on the board
 */
function Square({value, onSquareClick}) {
    return <button className="square" onClick={onSquareClick}>{value}</button>
}

/**
 * Loops through all the defined "lines" on the board and checks if all their values are equal, 
 * returning the value if they are all equal i.e. the winner.
 * If they are not all equal, simply returns null.
 * 
 * @param {Array} squares - The state array of squares 
 * @returns  {string|null} the winning value "X" or "O", or null
 */
function calculateWinner(squares) {
    for (const line of lines) {
        const [a, b, c] = line;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
          }
    }

    return null;
} 

/**
 * Manages the status of the game.
 * When a sqaure is clicked updates the squares based on who's turn it is, 
 * and then hands the sqaures to the Game component.
 * 
 * @returns {JSX Element | null} returns either the updated tic-tac-toe board, or null
 */
function Board({xIsNext, squares, onPlay}) {
    const [status, setStatus] = useState("Next player: X");

    function handClick(i) {
        if (squares[i] || calculateWinner(squares)) return;

        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? "X" : "O";

        onPlay(nextSquares);

        const winner = calculateWinner(nextSquares);
        if (winner) {
            setStatus(`Winner: ${winner}`);
        } else {
            setStatus(`Next player: ${xIsNext ? "O" : "X"}`);
        }
    }

    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handClick(2)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handClick(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handClick(8)} />
            </div>
        </>
    );
}

/**
 * Builds the game board and keeps a collection of the moves that have been made.
 * Manages what happens when you go back to a previous move made.
 * 
 * @returns {JSX Elements | null} the game which wraps the board and history of moves made
 */
export default function Game() {
    const [history, setHistroy] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const currentSquares = history[currentMove];
    const xIsNext = currentMove % 2 === 0;

    // updates the history, and the current move
    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistroy(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    // updates the board to the historical move selected
    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }


    const moves = history.map((sqaures, move) => {
        let description;
        if (move > 0) {
            description = `Go to move # ${move}`;
        } else {
            description = "Go to start of game";
        }
        return (
            <li key={move}> 
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    })

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}