import {PuzzlePieceObject} from "../logic/objects";
import {getStatic} from "../logic/socket";
import {motion} from "framer-motion";


interface PuzzlePieceProps {
    piece: PuzzlePieceObject;
    selected: boolean;
}


export default function PuzzlePiece({piece, selected}: PuzzlePieceProps) {
    return (
        <motion.image
            animate={{
                x: piece.x,
                y: piece.y,
            }}
            transition={{duration: 0.5}}
            imageRendering="optimizeSpeed"
            strokeWidth={selected ? 3 : 0}
            stroke={"black"}
            href={getStatic(piece.imageUrl)}
            width={piece.width * 1.03}
            height={piece.height * 1.03}
        />
    );
}
