export const utils = {
    checkIsOutSideChessBoard: (currentRow, currentColumn) => {
        if (currentColumn < 0 || currentColumn > 7 || currentRow < 0 || currentRow > 7) {
            return true;
        }

        return false;
    },
    checkIsLegalMove: ({ chessBoard, move, selectedBox }) => {
        const tempChessBoard = utils.movePieceOnBoard(JSON.parse(JSON.stringify(chessBoard)), move, selectedBox)
        const { checkFrom } = utils.willCheck(tempChessBoard, selectedBox);
        if (checkFrom.length > 0) return true
        return false;
    },
    pawnMoves: ({ chessBoard, selectedBox, stopRecursion }) => {
        const { color } = selectedBox.box;
        const { row, column } = selectedBox;

        // setting number of moves using moves count key
        const available_moves = [];
        const { move_count } = selectedBox.box;
        let number_of_moves = 1;
        if (move_count === 0 || !move_count) number_of_moves = 2;

        // adding move in available moves
        for (let i = 1; i <= number_of_moves; i++) {
            // setting row and column for white and black
            let currentRow = row + i
            let currentColumn = column;

            if (color === "black") {
                currentRow = row - i;
            }

            // checking is current box is outside the board
            const isOutSideChessBoard = utils.checkIsOutSideChessBoard(currentRow, currentColumn)
            if (isOutSideChessBoard) break;

            // checking is there already a piece on the moving place
            const currentBox = chessBoard[currentRow][currentColumn];
            if (currentBox.piece_name) break;

            let setBox = { ...selectedBox.box, move_count: i }

            if (i === 2) {
                setBox = { ...setBox, enPassent: true }
            }

            const move = {
                moveToBox: currentBox, moveToRow: currentRow, moveToColumn: currentColumn,
                selectedBox: setBox
            }

            if (!stopRecursion) {
                const isNotLegalMove = utils.checkIsLegalMove({ chessBoard, move, selectedBox });
                if (isNotLegalMove) break;
            }

            available_moves.push(move)
        }

        // adding killing boxes

        let killingColumns = [column + 1, column - 1];
        let killingRow = row + 1;

        if (color === "black") killingRow = row - 1;

        killingColumns.every(column => {
            const isOutSideChessBoard = utils.checkIsOutSideChessBoard(killingRow, column)
            if (isOutSideChessBoard) return true;

            const currentBox = chessBoard[killingRow][column];
            const enPassentBox = chessBoard[row][column];

            let setBox = { ...selectedBox.box, move_count: selectedBox.box.move_count + 1 }

            if (currentBox.color && currentBox.color !== color) {
                const move = {
                    moveToBox: currentBox, moveToRow: killingRow, moveToColumn: column,
                    selectedBox: setBox
                }

                if (!stopRecursion) {
                    const isNotLegalMove = utils.checkIsLegalMove({ chessBoard, move, selectedBox });
                    if (isNotLegalMove) return false;
                }

                available_moves.push(move)
            }

            if (enPassentBox.color && enPassentBox.color !== color && enPassentBox.enPassent) {
                const move = {
                    moveToBox: currentBox, moveToRow: killingRow, moveToColumn: column,
                    selectedBox: { ...setBox, enPassent: { removePawnRow: row, removePawnColumn: column } }
                }

                if (!stopRecursion) {
                    const isNotLegalMove = utils.checkIsLegalMove({ chessBoard, move, selectedBox });
                    if (isNotLegalMove) return false;
                }

                available_moves.push(move)
            }

            return true;
        })
        return available_moves;
    },
    bishopMoves: ({ chessBoard, selectedBox, stopRecursion }) => {

        const { color } = selectedBox.box;
        const { row, column } = selectedBox;

        const findMovesDiagonally = (y, x) => {
            const diagonal_moves = [];

            let currentRow = row + 1;
            let currentColumn = column + 1;

            if (y === "negative") {
                currentRow = row - 1;
            }

            if (x === "negative") {
                currentColumn = column - 1;
            }

            while (true) {
                const isOutSideChessBoard = utils.checkIsOutSideChessBoard(currentRow, currentColumn);
                if (isOutSideChessBoard) break;

                const currentBox = chessBoard[currentRow][currentColumn];

                if (currentBox.color && currentBox.color === color) break;

                const move = {
                    moveToBox: currentBox, moveToRow: currentRow, moveToColumn: currentColumn,
                    selectedBox: selectedBox.box
                }

                if (!stopRecursion) {
                    const isNotLegalMove = utils.checkIsLegalMove({ chessBoard, move, selectedBox });
                    if (isNotLegalMove) break;
                }

                diagonal_moves.push(move)

                if (currentBox.color && currentBox.color !== color) {
                    break;
                }

                if (y === "negative") {
                    currentRow--;
                } else {
                    currentRow++;
                }

                if (x === "negative") {
                    currentColumn--;
                } else {
                    currentColumn++;
                }
            }

            return diagonal_moves;
        }

        const topRight = findMovesDiagonally("positive", "positive");
        const bottomRight = findMovesDiagonally("negative", "positive");
        const topLeft = findMovesDiagonally("positive", "negative");
        const bottomLeft = findMovesDiagonally("negative", "negative");

        return [...topRight, ...bottomRight, ...topLeft, ...bottomLeft];
    },
    rookMoves: ({ chessBoard, selectedBox, stopRecursion }) => {

        const { color } = selectedBox.box;
        const { row, column } = selectedBox;

        const findMovesVertically = (direction, type) => {
            const vertical_moves = [];
            let currentRow;
            let currentColumn;

            if (direction === "horizontal") {
                currentRow = row;
                if (type === "negative") {
                    currentColumn = column - 1;
                } else {
                    currentColumn = column + 1;
                }
            }

            if (direction === "vertical") {
                currentColumn = column
                if (type === "negative") {
                    currentRow = row - 1;
                } else {
                    currentRow = row + 1;
                }
            }

            while (true) {
                const isOutSideChessBoard = utils.checkIsOutSideChessBoard(currentRow, currentColumn);
                if (isOutSideChessBoard) break;

                const currentBox = chessBoard[currentRow][currentColumn];

                if (currentBox.color && currentBox.color === color) break;


                let setBox;

                if (!selectedBox.moved) {
                    setBox = {
                        ...selectedBox.box,
                        moved: true
                    }
                }

                const move = {
                    moveToBox: currentBox, moveToRow: currentRow, moveToColumn: currentColumn,
                    selectedBox: setBox
                }

                if (!stopRecursion) {
                    const isNotLegalMove = utils.checkIsLegalMove({ chessBoard, move, selectedBox });
                    if (isNotLegalMove) break;
                }

                vertical_moves.push(move)

                if (currentBox.color && currentBox.color !== color) {
                    break;
                }

                if (direction === "vertical") {
                    if (type === "negative") {
                        currentRow--;
                    } else {
                        currentRow++;
                    }
                }

                if (direction === "horizontal") {
                    if (type === "negative") {
                        currentColumn--;
                    } else {
                        currentColumn++;
                    }
                }
            }

            return vertical_moves;
        }

        const top = findMovesVertically("vertical", "positive");
        const bottom = findMovesVertically("vertical", "negative");
        const left = findMovesVertically("horizontal", "positive");
        const right = findMovesVertically("horizontal", "negative");

        return [...top, ...bottom, ...left, ...right]
    },
    knightMoves: ({ chessBoard, selectedBox, stopRecursion }) => {

        const { color } = selectedBox.box;
        const { row, column } = selectedBox;

        const knight_moves = [];
        const columnMoves = [column + 2, column - 2];
        const rowMoves = [row + 2, row - 2];

        columnMoves.forEach((column) => {
            const rows = [row + 1, row - 1];

            rows.every((row) => {
                const isOutSideChessBoard = utils.checkIsOutSideChessBoard(row, column);
                if (isOutSideChessBoard) return true;

                const currentBox = chessBoard[row][column];
                if (currentBox.color === color) return true

                const move = {
                    moveToBox: currentBox, moveToRow: row, moveToColumn: column,
                    selectedBox: selectedBox.box
                };

                if (!stopRecursion) {
                    const isNotLegalMove = utils.checkIsLegalMove({ chessBoard, move, selectedBox });
                    if (isNotLegalMove) return true;
                }

                knight_moves.push(move)
                return true;
            })

        })

        rowMoves.forEach((row) => {
            const columns = [column + 1, column - 1];

            columns.every((column) => {
                const isOutSideChessBoard = utils.checkIsOutSideChessBoard(row, column);
                if (isOutSideChessBoard) return true;

                const currentBox = chessBoard[row][column];
                if (currentBox.color === color) return true;

                const move = {
                    moveToBox: currentBox, moveToRow: row, moveToColumn: column,
                    selectedBox: selectedBox.box
                }

                if (!stopRecursion) {
                    const isNotLegalMove = utils.checkIsLegalMove({ chessBoard, move, selectedBox });
                    if (isNotLegalMove) return true;
                }

                knight_moves.push(move)
                return true;
            })

        })
        return knight_moves;
    },
    kingMoves: ({ chessBoard, selectedBox, noLegalMoves }) => {

        const { color, moved } = selectedBox.box;
        const { row, column } = selectedBox;

        const king_moves = []

        const rowsMoves = [row - 1, row, row + 1];

        rowsMoves.forEach((rows) => {
            const columnMoves = [column - 1, column, column + 1];

            columnMoves.forEach((columns) => {
                const isOutSideChessBoard = utils.checkIsOutSideChessBoard(rows, columns);
                if (isOutSideChessBoard) return;

                if (rows === row && column === columns) return;

                const currentBox = chessBoard[rows][columns];

                if (currentBox.color !== color) {
                    let setBox;

                    if (!selectedBox.moved) {
                        setBox = {
                            ...selectedBox.box,
                            moved: true
                        }
                    }
                    king_moves.push({
                        moveToBox: currentBox, moveToRow: rows, moveToColumn: columns,
                        selectedBox: setBox
                    })
                }
            })
        })

        if (!moved) {
            const castlingMove = (direction) => {

                let currentColumn = column + 1;
                if (direction === "left") currentColumn = column - 1

                let count = 0;

                while (true) {
                    const isOutSideChessBoard = utils.checkIsOutSideChessBoard(row, currentColumn);
                    if (isOutSideChessBoard) break;

                    const currentBox = chessBoard[row][currentColumn]

                    let setBox = {
                        ...selectedBox.box,
                        moved: true
                    }

                    let rookTo = column + 1;
                    let kingTo = column + 2;

                    if (direction === "left") {
                        rookTo = column - 1;
                        kingTo = column - 2;
                    }

                    let castling = { count, rookTo }

                    if ((currentBox.piece_name && currentBox.piece_name !== "rook") || (currentBox.color && currentBox.color !== color)) break;

                    if (currentBox.piece_name === "rook" && currentBox.color === color && !currentBox.moved) {

                        castling = {
                            ...castling,
                            rookBox: currentBox,
                            rookRemoveColumn: currentColumn
                        }

                        king_moves.push({
                            moveToBox: chessBoard[row][kingTo], moveToRow: row, moveToColumn: kingTo,
                            selectedBox: setBox, castling
                        })
                    }

                    count++;

                    if (direction === "left") {
                        currentColumn--;
                    } else {
                        currentColumn++;
                    }
                }
            }

            castlingMove("left");
            castlingMove("right");

        }

        if (!noLegalMoves) {

            const legal_king_moves = [];

            king_moves.forEach((move) => {
                const boxPosition = { row: move.moveToRow, column: move.moveToColumn };
                const box = move.selectedBox;

                const tempChessBoard = utils.movePieceOnBoard(JSON.parse(JSON.stringify(chessBoard)), move, selectedBox)

                const { checkFrom } = utils.getThreatBy({ chessBoard: tempChessBoard, color: color === "white" ? "black" : "white", box, boxPosition });

                if (checkFrom.length === 0) {
                    if (move.castling) {
                        const left = legal_king_moves.find((checkMove) => checkMove.moveToColumn === move.moveToColumn - 1 && move.moveToRow === checkMove.moveToRow)
                        const right = legal_king_moves.find((checkMove) => checkMove.moveToColumn === move.moveToColumn + 1 && move.moveToRow === checkMove.moveToRow)

                        if (!left && !right) {
                            return;
                        }
                    }
                    legal_king_moves.push(move);
                }
            })

            return legal_king_moves;
        }

        return king_moves;
    },
    findPossibleMovesForActivePieces: ({ chessBoard, selectedBox, moves_to_save_check = [] }) => {

        const { piece_name } = selectedBox.box;
        let availableMoves = [];

        switch (piece_name) {
            case "pawn":
                availableMoves = utils.pawnMoves({ chessBoard, selectedBox });
                break;
            case "knight":
                availableMoves = utils.knightMoves({ chessBoard, selectedBox });
                break;
            case "bishop":
                availableMoves = utils.bishopMoves({ chessBoard, selectedBox });
                break;
            case "rook":
                availableMoves = utils.rookMoves({ chessBoard, selectedBox });
                break;
            case "queen":
                const queen_moves = [...utils.rookMoves({ chessBoard, selectedBox }), ...utils.bishopMoves({ chessBoard, selectedBox })]
                availableMoves = queen_moves;
                break;
            case "king":
                availableMoves = utils.kingMoves({ chessBoard, selectedBox });
                break;
            default: break;
        }

        if (moves_to_save_check.length > 0 && piece_name !== "king") {
            const safeMoves = [];
            availableMoves.forEach((move) => {
                const isSafeMove = moves_to_save_check.find((save_move) => save_move.moveToColumn === move.moveToColumn && save_move.moveToRow === move.moveToRow);
                if (isSafeMove) safeMoves.push(move);
            })
            return safeMoves
        }

        return availableMoves;
    },
    removeEnPassentProperty: (chessBoard = []) => {
        return chessBoard.map((row, i) => {
            if (i === 3 || i === 4) {
                row.map((column, ii) => {
                    if (column.enPassent) {
                        delete column.enPassent;
                    }
                    return column;
                })
            }
            return row;
        })
    },
    movePieceOnBoard: (chessBoard, movingTo, selectedBox) => {

        const enPassentRemovedBoard = utils.removeEnPassentProperty(chessBoard);

        const changedChessBoard = enPassentRemovedBoard.map((row, i) => {
            if (i === movingTo.moveToRow) {

                return row.map((column, ii) => {
                    if (ii === movingTo.moveToColumn) {
                        // if((i === 7 || i === 0) && selectedBox.box.piece_name === "pawn" && willChangeBoard){
                        //     alert("pawn at end")
                        // }

                        return movingTo.selectedBox;

                    }

                    return column;
                })
            }

            return row;
        })

        const removePieceFromBoard = changedChessBoard.map((row, i) => {
            if (i === selectedBox.row) {
                return row.map((column, ii) => {

                    if (ii === selectedBox.column) {
                        return {};
                    }

                    return column;
                })
            }

            return row;
        })

        if (movingTo.castling) {
            const { rookTo, rookBox, rookRemoveColumn } = movingTo.castling;

            return removePieceFromBoard.map((row, i) => {
                if (i === movingTo.moveToRow) {
                    return row.map((column, ii) => {

                        if (ii === rookRemoveColumn) {
                            return {};
                        }

                        if (ii === rookTo) {
                            return rookBox;
                        }

                        return column;
                    })
                }
                return row;
            })

        }

        if (movingTo.enPassent) {
            const { removePawnRow, removePawnColumn } = movingTo.enPassent;

            return removePieceFromBoard.map((row, i) => {
                if (i === removePawnRow) {
                    return row.map((column, ii) => {

                        if (ii === removePawnColumn) {
                            return {};
                        }

                        return column;
                    })
                }
                return row;
            })

        }

        return removePieceFromBoard;
    },
    getThreatBy: ({ chessBoard, color, box, boxPosition }) => {

        const checkFrom = [];
        let moves_that_can_save_check = [];

        const findTheThreat = ({ movesOfPiece = [], piece_name, is_queen }) => {
            movesOfPiece.every((move) => {
                if (move.moveToBox.piece_name && (move.moveToBox.piece_name === piece_name || move.moveToBox.piece_name === is_queen) && move.moveToBox.color === color) {

                    const columnDiff = move.moveToColumn - boxPosition.column;
                    const rowDiff = move.moveToRow - boxPosition.row;

                    let column = boxPosition.column;
                    let row = boxPosition.row;

                    let counter = 0

                    while (counter < 10) {
                        if (columnDiff > 0 && column < 7) {
                            column++;
                        } else if (columnDiff < 0 && column > 0) {
                            column--;
                        }

                        if (rowDiff > 0 && row < 7) {
                            row++;
                        } else if (rowDiff < 0 && row > 0) {
                            row--;
                        }

                        const currentBox = chessBoard[row][column];

                        if (currentBox) {
                            moves_that_can_save_check.push({
                                moveToBox: currentBox, moveToRow: row, moveToColumn: column,
                                selectedBox: box
                            })

                            if (currentBox.piece_name && (currentBox.piece_name === piece_name || currentBox.piece_name === is_queen) && currentBox.color === color) {
                                break;
                            }

                        }
                        counter++;
                    }

                    checkFrom.push(move);
                    return false;
                }
                return true;
            })
        }

        const checkFromBishop = utils.bishopMoves({ chessBoard, selectedBox: { ...boxPosition, box }, stopRecursion: true });
        findTheThreat({ movesOfPiece: checkFromBishop, piece_name: "bishop", is_queen: "queen" })

        const checkFromKnight = utils.knightMoves({ chessBoard, selectedBox: { ...boxPosition, box }, stopRecursion: true })
        findTheThreat({ movesOfPiece: checkFromKnight, piece_name: "knight" })

        const checkFromRook = utils.rookMoves({ chessBoard, selectedBox: { ...boxPosition, box }, stopRecursion: true });
        findTheThreat({ movesOfPiece: checkFromRook, piece_name: "rook", is_queen: "queen" })

        const checkFromPawn = utils.pawnMoves({ chessBoard, selectedBox: { ...boxPosition, box }, stopRecursion: true });
        findTheThreat({ movesOfPiece: checkFromPawn, piece_name: "pawn" })

        const checkFromKing = utils.kingMoves({ chessBoard, selectedBox: { ...boxPosition, box }, noLegalMoves: true });
        findTheThreat({ movesOfPiece: checkFromKing, piece_name: "king" })

        return { checkFrom, moves_that_can_save_check };
    },
    isCheck: ({ chessBoard, selectedBox }) => {
        let isCheckMate = false;
        let oppositionKingPosition;
        let oppositionKingBox;
        let oppositionPieces = [];

        const color = selectedBox.box.color;

        chessBoard.forEach((row, i) => {
            row.forEach((column, ii) => {
                if (column.color && column.color !== color) {
                    if (column.piece_name === "king") {
                        oppositionKingPosition = { row: i, column: ii };
                        oppositionKingBox = column;
                        return;
                    }

                    oppositionPieces.push({ row: i, column: ii, box: column })
                }
            })
        })

        const { checkFrom, moves_that_can_save_check } = utils.getThreatBy({ chessBoard, color, box: oppositionKingBox, boxPosition: oppositionKingPosition });

        const currentBox = { ...oppositionKingPosition, box: oppositionKingBox }
        const king_moves = utils.findPossibleMovesForActivePieces({ chessBoard, selectedBox: currentBox, moves_to_save_check: moves_that_can_save_check });

        if (checkFrom.length > 0) {
            const audio = new Audio("./check.mp3");
            audio.play();

            if (king_moves.length === 0) {

                isCheckMate = true;
                oppositionPieces.every((piece) => {

                    const haveSafeMoves = utils.findPossibleMovesForActivePieces({ chessBoard, selectedBox: piece, moves_to_save_check: moves_that_can_save_check });

                    if (haveSafeMoves.length > 0) {
                        isCheckMate = false;
                        return false;
                    }

                    return true;
                })
            }
        }

        if (checkFrom.length > 1) {
            moves_that_can_save_check.length = 0;

            if (king_moves.length === 0) {
                isCheckMate = true;
            }
        }

        return { moves_that_can_save_check, isCheckMate };
    },
    willCheck: (chessBoard, selectedBox) => {
        let oppositionKingPosition;
        let oppositionKingBox;

        const color = selectedBox.box.color === "white" ? "black" : "white";

        chessBoard.forEach((row, i) => {
            row.forEach((column, ii) => {
                if (column.color && column.color !== color) {
                    if (column.piece_name === "king") {
                        oppositionKingPosition = { row: i, column: ii };
                        oppositionKingBox = column;
                        return;
                    }

                }
            })
        })

        const { checkFrom } = utils.getThreatBy({ chessBoard, color, box: oppositionKingBox, boxPosition: oppositionKingPosition });
        return { checkFrom };
    },
    pawnAtEnd: ({ box, movingTo }) => {
            if (movingTo.selectedBox.piece_name === "pawn" && movingTo.selectedBox.move_count === 6) {
                const left = box.getBoundingClientRect().left;
                const top = box.getBoundingClientRect().top;

                const piecesDropdownParent = document.querySelector(".main .pieces-dropdown-parent");
                const piecesDropdown = piecesDropdownParent.querySelector(".pieces-dropdown")

                piecesDropdown.style.left = `${left}px`;
                piecesDropdown.style.top = `${top}px`;

                piecesDropdownParent.classList.remove("hidden")
                return true;
            }
        return false;
    },
    // movePiece:({chessBoard=[[]],movingTo})=>{
    //     return chessBoard.map((row, i) => {
    //         if (i === movingTo.moveToRow) {

    //             return row.map((column, ii) => {
    //                 if (ii === movingTo.moveToColumn) {
    //                     return movingTo.selectedBox;
    //                 }

    //                 return column;
    //             })
    //         }

    //         return row;
    //     })
    // }
}