const createChessBoard = () => {
    const blankLine = [{}, {}, {}, {}, {}, {}, {}, {}];

    const whitePiecesLine = [
        { piece_name: "rook", color: "white", moved: false },
        { piece_name: "knight", color: "white" },
        { piece_name: "bishop", color: "white" },
        { piece_name: "king", color: "white", moved: false },
        { piece_name: "queen", color: "white" },
        { piece_name: "bishop", color: "white" },
        { piece_name: "knight", color: "white" },
        { piece_name: "rook", color: "white", moved: false },
    ];

    const blackPiecesLine = [
        { piece_name: "rook", color: "black", moved: false },
        { piece_name: "knight", color: "black" },
        { piece_name: "bishop", color: "black" },
        { piece_name: "king", color: "black", moved: false },
        { piece_name: "queen", color: "black" },
        { piece_name: "bishop", color: "black" },
        { piece_name: "knight", color: "black" },
        { piece_name: "rook", color: "black", moved: false },
    ];

    const whitePawnLine = [
        {
            piece_name: "pawn",
            color: "white",
            move_count: 0,
        },
        {
            piece_name: "pawn",
            color: "white",
            move_count: 0,
        },
        {
            piece_name: "pawn",
            color: "white",
            move_count: 0,
        },
        {
            piece_name: "pawn",
            color: "white",
            move_count: 0,
        },
        {
            piece_name: "pawn",
            color: "white",
            move_count: 0,
        },
        {
            piece_name: "pawn",
            color: "white",
            move_count: 0,
        },
        {
            piece_name: "pawn",
            color: "white",
            move_count: 0,
        },
        {
            piece_name: "pawn",
            color: "white",
            move_count: 0,
        },
    ];

    const blackPawnLine = [
        {
            piece_name: "pawn",
            color: "black",
            move_count: 0,
        },
        {
            piece_name: "pawn",
            color: "black",
            move_count: 0,
        },
        {
            piece_name: "pawn",
            color: "black",
            move_count: 0,
        },
        {
            piece_name: "pawn",
            color: "black",
            move_count: 0,
        },
        {
            piece_name: "pawn",
            color: "black",
            move_count: 0,
        },
        {
            piece_name: "pawn",
            color: "black",
            move_count: 0,
        },
        {
            piece_name: "pawn",
            color: "black",
            move_count: 0,
        },
        {
            piece_name: "pawn",
            color: "black",
            move_count: 0,
        },
    ];

    const blankLine1 = [...blankLine];
    const blankLine2 = [...blankLine];
    const blankLine3 = [...blankLine];
    const blankLine4 = [...blankLine];

    const Board = [
        whitePiecesLine,
        whitePawnLine,
        blankLine1,
        blankLine2,
        blankLine3,
        blankLine4,
        blackPawnLine,
        blackPiecesLine,
    ];
    return Board;
};

export default createChessBoard;
