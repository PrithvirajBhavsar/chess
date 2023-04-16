import React from 'react'
import Modal from './Modal'
import createChessBoard from '../chess-board-matrix/matrix';

const WinnerModal = ({ players, side, active,setChessBoard, setActive }) => {

    const chessBoardDefault = createChessBoard();

    const handleNewPlayer = ()=>{
        window.location.reload();
    }

    const handlePlayAgain = ()=>{
        setChessBoard(chessBoardDefault);
        setActive(false)
    }

    const Body = () => {
        return (
            <div>
                <div style={{ backgroundColor: "inherit" }} className='winner-popper'>
                    <img height={100} width={100} alt='party-popper' src='./party-popper.jpg'></img>
                    <p className='text-white'><b>{players[side]} Won </b> ({side})</p>
                </div>
                <div className='game-buttons mt-1'>
                    <button onClick={handleNewPlayer} className='primary btn'>New Players</button>
                    <button onClick={handlePlayAgain} className='primary btn'>Play Again</button>
                </div>
            </div>
        )
    }

    return (
        <Modal active={active} body={<Body />} />
    )
}

export default WinnerModal