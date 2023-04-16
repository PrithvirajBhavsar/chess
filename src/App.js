import { useEffect, useState } from "react";
import "./App.css";
import createChessBoard from "./chess-board-matrix/matrix";
import Box from "./component/Box";
import uniqid from "uniqid";
import { utils } from "./utils";
import DropDown from "./component/DropDown";
import PlayerModal from "./component/PlayerModal";
import WinnerModal from "./component/WinnerModal";

function App() {

  const audio = new Audio('./piece_move_sound.wav');
  const COLOR = { BLACK: "black", WHITE: "white" };
  const chessBoardDefault = createChessBoard();
  const [chessBoard, setChessBoard] = useState(chessBoardDefault);
  const [selectedBox, setSelectedBox] = useState(null);
  const [side, setSide] = useState(COLOR.WHITE);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [readyToMove, setReadyToMove] = useState(false);
  const [movesToSaveCheck, setMovesToSaveCheck] = useState([]);
  const [pawnToPiece, setPawnToPiece] = useState(null);
  const [movingTo, setMovingTo] = useState(null)
  const [players, setPlayers] = useState({white:"Player Name",black:"Player Name"})
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (pawnToPiece && movingTo) {
      const movingToBox = { ...movingTo, selectedBox: pawnToPiece }
      const changedChessBoard = utils.movePieceOnBoard(chessBoard, movingToBox, selectedBox, true);
      audio.play();
      setChessBoard(changedChessBoard);
      const { moves_that_can_save_check, isCheckMate } = utils.isCheck({ chessBoard: changedChessBoard, selectedBox });

      if (isCheckMate) {
        setActive(true);
        return;
      }
      setMovesToSaveCheck(moves_that_can_save_check);
      setTimeout(() => {
        setSide((side === COLOR.WHITE) ? COLOR.BLACK : COLOR.WHITE);
      }, 500);
      setReadyToMove(false)
    }
  }, [pawnToPiece])

  useEffect(() => {
    if (selectedBox && selectedBox.box.piece_name) {
      const { row, column } = selectedBox;
      document.getElementById(`${row}-${column}`).classList.toggle("selected");
    }
  }, [selectedBox]);

  useEffect(() => {
    if (possibleMoves && possibleMoves.length > 0) {
      possibleMoves.forEach(({ moveToRow, moveToColumn, moveToBox, enPassent }) => {
        const possible = document.getElementById(`${moveToRow}-${moveToColumn}`)
        possible.classList.add("possible");
        const div = document.createElement("div")
        if (moveToBox.piece_name || enPassent) {
          div.classList.add("circle");
        } else {
          div.classList.add("sphere");
        }
        possible.append(div);
      })
    }
  }, [possibleMoves]);

  const checkNumber = (number) => {
    if (number % 2 === 0) {
      return true;
    }
  };

  const handleBoxClick = async ({ event, parentIndex, index, box }) => {
    const currentBox = { row: parentIndex, column: index, box }

    if (readyToMove) {
      setPossibleMoves([])
      const movingToBox = possibleMoves.find((move) => move.moveToRow === parentIndex && move.moveToColumn === index);

      if (movingToBox) {
        setMovingTo(movingToBox);
        const isPawnAtEnd = utils.pawnAtEnd({ box: event.currentTarget, movingTo: movingToBox });

        if (isPawnAtEnd) return;
        const changedChessBoard = utils.movePieceOnBoard(chessBoard, movingToBox, selectedBox, true);
        audio.play();
        setChessBoard(changedChessBoard);
        const { moves_that_can_save_check, isCheckMate } = utils.isCheck({ chessBoard: changedChessBoard, selectedBox });

        if (isCheckMate) {
          setActive(true);
          return;
        }
        setMovesToSaveCheck(moves_that_can_save_check);
        setTimeout(() => {
          setSide((side === COLOR.WHITE) ? COLOR.BLACK : COLOR.WHITE);
        }, 500);
        setReadyToMove(false)
        return;
      }

    }

    if (box.color && box.color === side) {
      setPossibleMoves(utils.findPossibleMovesForActivePieces({ chessBoard, selectedBox: currentBox, moves_to_save_check: movesToSaveCheck }));
      setReadyToMove(true)
    }
    setSelectedBox(currentBox);

    if (!readyToMove) {
      setReadyToMove(true)
    }

  }

  const boxCreation = (parentIndex, index, showParentIndex, showIndex) => {
    const box = chessBoard[parentIndex][index];
    const isWhite = checkNumber(parentIndex + index);
    return (
      <Box
        isSelected={box.isSelected}
        handleClick={(event) =>
          handleBoxClick({ event, parentIndex, index, box })
        }
        color={box.color}
        piece_name={box.piece_name}
        parentIndex={parentIndex}
        index={index}
        showParentIndex={showParentIndex}
        showIndex={showIndex}
        key={uniqid()}
        isWhite={isWhite}
      />
    );
  };

  const renderChessBoard = () => {
    const createdChessBoard = [];

    for (let i = 0; i < 8; i++) {
      let showParentIndex = true;
      let showIndex = false;

      if (i === 7) showIndex = true;

      for (let j = 0; j < 8; j++) {
        if (side === COLOR.WHITE)
          createdChessBoard.push(
            boxCreation(7 - i, 7 - j, showParentIndex, showIndex)
          );
        else if (side === COLOR.BLACK)
          createdChessBoard.push(boxCreation(i, j, showParentIndex, showIndex));

        showParentIndex = false;
      }
    }

    return createdChessBoard;
  };

  return (
    <>
    <div className="main">
      <div className="player-top player">
        <div>
          <img alt="king" src={`./chess-pieces-images/${(side === COLOR.WHITE) ? COLOR.BLACK : COLOR.WHITE}-king.png`}></img>
          <b>{players[(side === COLOR.WHITE) ? COLOR.BLACK : COLOR.WHITE]}</b>
        </div>
      </div>
      <div id="chess-board" className="chess-board">
        {renderChessBoard()}
        <DropDown setPawnToPiece={setPawnToPiece} color={side.toLowerCase()} />
      </div>
      <div className="player-bottom player">
        <div>
          <img alt="king" src={`./chess-pieces-images/${side}-king.png`}></img>
          <b>{players[side]}</b>
        </div>
      </div>
    </div>
      <PlayerModal players={players} setPlayers={setPlayers}/>
      <WinnerModal setActive={setActive} setChessBoard={setChessBoard} active={active} players={players} side={side}/>
    </>
  );
}

export default App;
