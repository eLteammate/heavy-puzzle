import {useGesture} from "@use-gesture/react";
import {useRef} from "react";
import {PuzzleBlockObject} from "../logic/objects";
import PuzzlePiece from "./PuzzlePiece";


interface PuzzleBlockProps {
    block: PuzzleBlockObject;
}


export default function PuzzleBlock({block}: PuzzleBlockProps) {
    const groupRef = useRef<SVGGElement>(null);

    useGesture({
        onDrag: (e) => {

        }
    }, {
        target: groupRef,
    });

    return (
        <g ref={groupRef}>
            {block.pieces.map(piece => <PuzzlePiece piece={piece} key={piece.id}/>)}
        </g>
    );
}
