import {useGesture} from "@use-gesture/react";
import React, {useContext, useRef} from "react";
import {PuzzleBlockObject} from "../logic/objects";
import PuzzlePiece from "./PuzzlePiece";
import {motion} from "framer-motion";
import {dragBlock, releaseBlock} from "../logic/socket";
import {CanvasCoordinatesContext} from "./Canvas";


interface PuzzleBlockProps {
    block: PuzzleBlockObject;
}


export function useDragBlock(block: PuzzleBlockObject) {
    const groupRef = useRef<SVGGElement>(null);
    const scale = useContext(CanvasCoordinatesContext);

    useGesture({
        onDrag: e => dragBlock(block.id, e.offset[0], e.offset[1]),
        onDragEnd: () => releaseBlock(),
    }, {
        target: groupRef,
        drag: {
            from: () => [block.centerX, block.centerY],
            transform: ([dx, dy]) => [dx / scale, dy / scale],
            bounds: {top: 50, bottom: 950, left: 50, right: 950},
        },
    });

    return groupRef;
}


export default function PuzzleBlock({block}: PuzzleBlockProps) {
    const groupRef = useDragBlock(block);

    return (
        <motion.g ref={groupRef} style={{touchAction: "none"}}>
            {block.pieces.map(piece => <motion.rect
                animate={{
                    x: piece.x,
                    y: piece.y,
                }}
                width={piece.width * 1.03}
                height={piece.height * 1.03}
                stroke="white"
                strokeWidth={2}
                transition={{duration: 0.5}}
                key={-block.id}
            />)}

            {[...block.pieces].sort(
                (p1, p2) => (p1.id - p2.id),
            ).map(piece =>
                <PuzzlePiece
                    selected={true}
                    piece={piece}
                    key={piece.id}
                />)}
        </motion.g>
    );
}
