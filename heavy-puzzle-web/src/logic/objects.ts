export interface PuzzlePieceObject {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    imageUrl: string;
    gridPositionX: number;
    gridPositionY: number;
}


export interface DraggingUserObject {
    id: string,
    x: number,
    y: number,
}


export interface PuzzleBlockObject {
    id: number;
    pieces: PuzzlePieceObject[];
    draggingUsers: DraggingUserObject[];
    weight: number;
    centerX: number;
    centerY: number;
}
