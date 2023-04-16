import React from 'react'
import './Box.css';

const addImage = ({ color, piece_name }) => {
    if (color && piece_name) {
        return <img draggable={true} alt={piece_name} src={`./chess-pieces-images/${color}-${piece_name}.png`}></img>
    }
}

const convertColumnNumberToAlphabet = (index) => {
    switch (index) {
        case 7: return "a"
        case 6: return "b"
        case 5: return "c"
        case 4: return "d"
        case 3: return "e"
        case 2: return "f"
        case 1: return "g"
        case 0: return "h"
        default: return index;
    }
}

const Box = ({ color, piece_name, parentIndex, index, isWhite, handleClick, isSelected, showParentIndex, showIndex }) => {
    return (
        <div id={`${parentIndex}-${index}`} onMouseDown={handleClick} onDragOver={(e) => e.preventDefault()} className={`box ${(isSelected) ? "selected" : ""} ${(isWhite) ? "white" : "green"} ${(piece_name) ? "is-cursor-pointer" : ""}`}>
            {(showParentIndex) ? <p className='box-row'>{`${parentIndex + 1}`}</p> : ""}
            {(showIndex) ? <p className='box-column'>{`${convertColumnNumberToAlphabet(index)}`}</p> : ""}
            <p className='box-number'>{`${parentIndex}-${index}`}</p>
            {addImage({ color, piece_name })}
        </div>
    )
}

export default Box