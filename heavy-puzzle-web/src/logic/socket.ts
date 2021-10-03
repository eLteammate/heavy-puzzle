import {io} from "socket.io-client";
import {PuzzleBlockObject} from "./objects";
import {store} from "../store/store";
import {puzzleSlice} from "../store/puzzleSlice";


const socket = io(process.env.REACT_APP_API_URL as string);


socket.on("connect", () => {

});


socket.on("state", data => {
    const blocks = data.blocks as PuzzleBlockObject[];
    store.dispatch(puzzleSlice.actions.set(blocks));
});


export function getStatic(url: string) {
    return process.env.REACT_APP_API_URL as string + url;
}


interface LastRequest {
    type: string;
    data: object;
}


let lastRequest: LastRequest | undefined = undefined;


export function dragBlock(blockId: number, x: number, y: number) {
    lastRequest = {
        type: "drag",
        data: {
            blockId: blockId,
            x: x,
            y: y,
        },
    };
}


export function releaseBlock() {
    lastRequest = {
        type: "release",
        data: {},
    };
}


setInterval(() => {
    if (lastRequest) {
        socket.emit(lastRequest.type, lastRequest.data);
        lastRequest = undefined;
    }
}, 50);
