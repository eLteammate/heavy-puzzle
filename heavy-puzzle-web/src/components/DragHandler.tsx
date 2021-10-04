import {PuzzleBlockObject} from "../logic/objects";
import {motion} from "framer-motion";
import React from "react";
import {useDragBlock} from "./PuzzleBlock";


interface DragHandlerProps {
    block: PuzzleBlockObject;
}


export default function DragHandler({block}: DragHandlerProps) {
    const groupRef = useDragBlock(block);

    const color = `hsl(${(block.id * 1337) % 360} 100% 50%)`;

    return (
        <motion.g
            initial={{opacity: 0}}
            animate={{opacity: block.draggingUsers.length > 0 ? 1 : 0}}
            transition={{duration: 0.15}}
            key={block.id}
            ref={groupRef}
        >
            {
                block.draggingUsers.map(drag => <React.Fragment key={drag.id}>
                    <motion.line
                        x1={block.centerX} y1={block.centerY}
                        initial={{x2: drag.x, y2: drag.y}}
                        animate={{x2: drag.x, y2: drag.y}}
                        transition={{duration: 0.5}}
                        stroke={color}
                        strokeWidth={5}
                        key={`l${drag.id}`}
                        z={10}
                    />
                    <motion.circle
                        initial={{r: "0.1cm", cx: drag.x, cy: drag.y}}
                        animate={{r: "0.3cm", cx: drag.x, cy: drag.y}}
                        transition={{duration: 0.5}}
                        fill={color}
                        key={`c${drag.id}`}
                    />
                </React.Fragment>)
            }
            <motion.circle
                initial={{r: "0.1cm"}}
                animate={{r: block.draggingUsers.length > 0 ? "0.4cm" : "0.1cm"}}
                transition={{duration: 0.5}}

                cx={block.centerX}
                cy={block.centerY}
                stroke={color} strokeWidth={6}
                fill="white"
                key={block.id + 1000}
            />
            <motion.circle
                initial={{r: "0.1cm"}}
                animate={{r: `${0.33 * block.draggingUsers.length / block.weight}cm`}}
                transition={{duration: 0.5}}

                cx={block.centerX}
                cy={block.centerY}
                fill={color}
                key={-block.id}
            />
        </motion.g>
    );
}
