import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {PuzzleBlockObject} from "../logic/objects";
import {RootState} from "./store";


interface PuzzleState {
    pieces?: PuzzleBlockObject[];
}


const initialState: PuzzleState = {
    pieces: undefined,
};

export const puzzleSlice = createSlice({
    name: 'puzzle',
    initialState,
    reducers: {
        set: (state, action: PayloadAction<PuzzleBlockObject[]>) => {
            state.pieces = action.payload;
        },
    },
});

export const selectPuzzle = (state: RootState) => state.puzzle.pieces;

export const puzzleSliceReducer = puzzleSlice.reducer;