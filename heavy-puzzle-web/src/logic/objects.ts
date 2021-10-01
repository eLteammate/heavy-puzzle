export interface PuzzlePieceObject {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    imageUrl: string;
    shapeId: number;
    gridPositionX: number;
    gridPositionY: number;
}


export interface PuzzleBlockObject {
    id: number;
    pieces: PuzzlePieceObject[];
    weight: number;
    centerX: number;
    centerY: number;
}
