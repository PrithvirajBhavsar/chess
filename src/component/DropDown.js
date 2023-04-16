import React from 'react'
import './DropDown.css';

const DropDown = ({ color = "black",setPawnToPiece }) => {

    const piecesToSelect = ["queen", "rook", "bishop", "knight"];

    const handleClick = ({ event, piece }) => {
        setPawnToPiece({
            piece_name:piece,
            color,
            moved:true,
        })
        console.log(`${piece} selected`);
        const piecesDropdown = document.querySelector(".chess-board .pieces-dropdown-parent");
        piecesDropdown.classList.add("hidden")
    }

    return (
        <div className='pieces-dropdown-parent hidden'>
            <div className="pieces-dropdown">
                {piecesToSelect.map((piece) => {
                    return <div onClick={(event) => handleClick({ event, piece })} key={piece} className='box dropdown-box'><img src={`/chess-pieces-images/${color}-${piece}.png`} alt="pieces"></img></div>
                })}
            </div >
        </div>
    )
}

export default DropDown;