import random
import uuid
from pathlib import Path

import PIL.Image as Image

import models
from app import session
from config import settings


def reset_all():
    static_files_dir = Path("./static")
    image_id = uuid.uuid4()
    (static_files_dir / image_id.hex).mkdir()

    session.query(models.PuzzlePiece).delete()
    session.query(models.PuzzleBlock).delete()
    session.query(models.DraggingUser).delete()

    with Image.open(static_files_dir / settings.image.filename) as image:
        width, height = image.size
        rows = settings.image.rows
        columns = settings.image.columns
        row_size = height // rows
        column_size = width // columns

        positions = [(i % columns, i // columns) for i in range(rows * columns)]
        random.shuffle(positions)

        # piece_width = 500 // columns
        piece_width = column_size // settings.image.scale
        # piece_height = (500 * height // width) // rows
        piece_height = row_size // settings.image.scale

        i = 0
        for y in range(0, row_size * rows, row_size):
            for x in range(0, column_size * columns, column_size):
                piece = image.crop((x, y, x + int(column_size * 1.03), y + int(row_size * 1.03)))
                name = image_id.hex + f"/{y // row_size}-{x // column_size}.jpg"
                piece.save(static_files_dir / name)

                canvas_x = 250 + positions[i][0] * piece_width
                canvas_y = 250 + positions[i][1] * piece_height
                i += 1
                block_object = models.PuzzleBlock(
                    center_x=(canvas_x + piece_width / 2),
                    center_y=(canvas_y + piece_height / 2),
                    weight=1,
                )

                piece_object = models.PuzzlePiece(
                    x=canvas_x,
                    y=canvas_y,
                    width=piece_width,
                    height=piece_height,
                    image_url=f"static/{name}",
                    grid_position_x=x // column_size,
                    grid_position_y=y // row_size,
                )

                block_object.pieces.append(piece_object)
                session.add_all((block_object, piece_object))

    session.commit()


if __name__ == '__main__':
    reset_all()
