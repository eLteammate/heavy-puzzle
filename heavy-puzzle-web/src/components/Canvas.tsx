import React, {useEffect, useRef, useState} from "react";
import {Center} from "@chakra-ui/react";
import {useGesture} from "@use-gesture/react";
import {useAppSelector} from "../store/store";
import {selectPuzzle} from "../store/puzzleSlice";
import PuzzleBlock from "./PuzzleBlock";
import {motion} from "framer-motion";
import DragHandler from "./DragHandler";


const clamp = (x: any, min: any, max: any) => {
    if (x < min) {
        return min;
    } else if (x > max) {
        return max;
    } else {
        return x;
    }
};

const canvasUnscaledSize = 1000;


interface CanvasTransition {
    offsetX: number;
    offsetY: number;
    scale: number;
    trueScale?: number;
    width: number;
    height: number;
}


const limitTransition = (transition: CanvasTransition, container: HTMLDivElement): CanvasTransition => {
    const rect = container.getBoundingClientRect();

    const scale = transition.scale;
    const trueScale = Math.max(rect.width, rect.height) / canvasUnscaledSize * scale;
    const size = canvasUnscaledSize / scale;

    let width, height;
    if (rect.width > rect.height) {
        width = size;
        height = width / rect.width * rect.height;
    } else {
        height = size;
        width = height / rect.height * rect.width;
    }

    const trueX = clamp(transition.offsetX, 0, canvasUnscaledSize - width);
    const trueY = clamp(transition.offsetY, 0, canvasUnscaledSize - height);

    return {
        offsetX: trueX,
        offsetY: trueY,
        scale: scale,
        trueScale: trueScale,
        width: width,
        height: height,
    };
};


export const CanvasCoordinatesContext = React.createContext(1);


export default function Canvas() {
    const puzzle = useAppSelector(selectPuzzle);

    const container = useRef<HTMLDivElement>(null);
    const canvasHandlerElement = useRef<SVGRectElement>(null);

    const [transition, setTransition] = useState<CanvasTransition>({
        offsetX: 0,
        offsetY: 0,
        scale: 1,
        width: canvasUnscaledSize,
        height: canvasUnscaledSize,
        trueScale: undefined,
    });

    useGesture({
        onDrag: (e) => {
            const limited = limitTransition(
                {
                    ...transition,
                    offsetX: transition.offsetX - e.delta[0] / (transition.trueScale || 1),
                    offsetY: transition.offsetY - e.delta[1] / (transition.trueScale || 1),
                },
                container.current!!,
            );
            setTransition(limited);
        },
        // onDragStart: () => dispatch(userSlice.actions.setMovesPuzzle("canvas")),
        // onDragEnd: () => dispatch(userSlice.actions.setMovesPuzzle(undefined)),
        onPinch: (e) => {
            setTransition(limitTransition(
                {
                    ...transition,
                    scale: e.offset[0],
                },
                container.current!!,
            ));
        },
    }, {
        target: canvasHandlerElement,
        pinch: {
            scaleBounds: [1, 5],
        },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => setTransition(limitTransition(transition, container.current!!)), []);

    return (
        <CanvasCoordinatesContext.Provider value={transition.trueScale || 1}>
            <Center overflow="hidden" h="100vh" ref={container}>
                <motion.svg
                    animate={{
                        viewBox: `
                        ${transition.offsetX.toFixed(2)} 
                        ${transition.offsetY.toFixed(2)} 
                        ${transition.width} ${transition.height}
                        `,
                    }}
                    style={{touchAction: "none"}}
                >
                    <rect
                        ref={canvasHandlerElement}
                        width={1000} height={1000} fill="#181818"
                        style={{touchAction: "none"}}
                    />
                    {[...(puzzle || [])].sort(
                        (p1, p2) => (p2.weight - p1.weight),
                    ).map(block => (
                        <PuzzleBlock
                            block={block}
                            key={block.id}
                        />
                    ))}
                    {puzzle?.map(block => (
                        <DragHandler block={block} key={block.id}/>
                    ))}
                </motion.svg>
            </Center>
        </CanvasCoordinatesContext.Provider>
    );
}
