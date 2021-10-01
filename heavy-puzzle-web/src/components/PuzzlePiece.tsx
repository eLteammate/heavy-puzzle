import {PuzzlePieceObject} from "../logic/objects";


interface PuzzlePieceProps {
    piece: PuzzlePieceObject;
}


export default function PuzzlePiece({piece}: PuzzlePieceProps) {
    return (
        <image
            x={piece.x}
            y={piece.y}
            href={piece.imageUrl}
            width={piece.width}
            height={piece.height}
        />
    );
}
