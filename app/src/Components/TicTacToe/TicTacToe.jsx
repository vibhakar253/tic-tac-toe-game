import { useRef, useState } from "react";
import "./TicTacToe.css";
import circle_icon from "../assets/circle.png";
import cross_icon from "../assets/cross.png";
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [count, setCount] = useState(0);
  const [lock, setLock] = useState(false);
  const [status, setStatus] = useState("Player O's turn");
  const [showModal, setShowModal] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const titleRef = useRef(null);
  
  // Get window dimensions for confetti effect
  const [windowWidth, windowHeight] = useWindowSize();

  // Declare each box ref individually
  const box1 = useRef(null);
  const box2 = useRef(null);
  const box3 = useRef(null);
  const box4 = useRef(null);
  const box5 = useRef(null);
  const box6 = useRef(null);
  const box7 = useRef(null);
  const box8 = useRef(null);
  const box9 = useRef(null);

  // Collect all box refs into an array
  const boxRefs = [box1, box2, box3, box4, box5, box6, box7, box8, box9];

  const toggle = (index) => {
    if (lock || board[index]) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = count % 2 === 0 ? "o" : "x";
    setBoard(newBoard);
    setCount(count + 1);

    const imgIcon = count % 2 === 0 ? circle_icon : cross_icon;
    boxRefs[index].current.innerHTML = `<img src="${imgIcon}" alt="${newBoard[index]}" />`;

    checkWin(newBoard);
  };

  const checkWin = (currentBoard) => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[b] === currentBoard[c]) {
        won(currentBoard[a]);
        return;
      }
    }

    if (currentBoard.every(cell => cell)) {
      setStatus("It's a Draw!");
      setWinner("Draw");
      setShowModal(true);
      setLock(true);
    } else {
      setStatus(`Player ${count % 2 === 0 ? "X" : "O"}'s turn`);
    }
  };

  const won = (winner) => {
    setLock(true);
    setWinner(winner.toUpperCase());
    setShowModal(true);
    setShowConfetti(true);
    setStatus(`Player ${winner.toUpperCase()} wins!`);
    titleRef.current.innerHTML = `Congratulations: <img src=${winner === "x" ? cross_icon : circle_icon} alt="${winner}" />`;
  };

  const reset = () => {
    setLock(false);
    setBoard(Array(9).fill(""));
    setCount(0);
    setStatus("Player O's turn");
    setShowModal(false);
    setWinner(null);
    setShowConfetti(false);
    titleRef.current.innerHTML = 'Tic Tac Toe';
    boxRefs.forEach(ref => {
      ref.current.innerHTML = "";
    });
  };

  return (
    <div className='container'>
      {showConfetti && <Confetti width={windowWidth} height={windowHeight} />} {/* Full-screen confetti */}
      <h1 className="title" ref={titleRef}>Tic Tac Toe</h1>
      <div className="status">{status}</div> {/* Display for game status */}
      <div className="board">
        {board.map((_, index) => (
          <div
            key={index}
            className="boxes"
            ref={boxRefs[index]}
            onClick={() => toggle(index)}
          ></div>
        ))}
      </div>
      <button className="reset" onClick={reset}>Reset</button>
      
      {/* Modal for displaying result */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            {winner === "Draw" ? (
              <p>It's a Draw!</p>
            ) : (
              <p>Player {winner} wins!</p>
            )}
            <button onClick={reset} className="close-modal">Play Again</button>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default TicTacToe;
