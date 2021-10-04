import itertools
from datetime import datetime, timedelta

from sqlalchemy import or_

from app import socket_io, session
from models import DraggingUser, PuzzleBlock


@socket_io.event
def drag(sid, data):
    session.merge(DraggingUser(
        id=sid, x=data["x"], y=data["y"],
        block_id=data["blockId"], expires=datetime.now() + timedelta(seconds=10)))
    block: PuzzleBlock = session.query(PuzzleBlock).filter(PuzzleBlock.id == data["blockId"]).one()
    k = len(block.dragging_users)

    x = sum(d.x for d in block.dragging_users) / k
    y = sum(d.y for d in block.dragging_users) / k
    offset_x = x - block.center_x
    offset_y = y - block.center_y

    if k < block.weight:
        offset_x /= 3000 * block.weight
        offset_y /= 3000 * block.weight

    for piece in block.pieces:
        piece.x += offset_x
        piece.y += offset_y
    k = len(block.pieces)
    block.center_x = sum(p.x for p in block.pieces) / k + block.pieces[0].width / 2
    block.center_y = sum(p.y for p in block.pieces) / k + block.pieces[0].height / 2

    session.add_all((block, *block.pieces))
    session.commit()


@socket_io.event
def release(sid, _):
    session.query(DraggingUser).filter(DraggingUser.id == sid).delete()


@socket_io.event
def disconnect(sid):
    session.query(DraggingUser).filter(DraggingUser.id == sid).delete()


def try_merge(b1: PuzzleBlock, b2: PuzzleBlock):
    for p1 in b1.pieces:
        for p2 in b2.pieces:
            gx1 = p1.grid_position_x
            gx2 = p2.grid_position_x
            gy1 = p1.grid_position_y
            gy2 = p2.grid_position_y
            delta_x = gx2 - gx1
            delta_y = gy2 - gy1
            x1 = p1.x
            y1 = p1.y
            x2 = p2.x
            y2 = p2.y

            if abs(delta_x) + abs(delta_y) != 1:
                continue

            if delta_x == 1 and delta_y == 0:
                x2 -= p2.width
            elif delta_x == -1 and delta_y == 0:
                x2 += p2.width
            elif delta_x == 0 and delta_y == 1:
                y2 -= p2.height
            elif delta_x == 0 and delta_y == -1:
                y2 += p2.height

            if abs(x1 - x2) + abs(y1 - y2) < 6:
                offset_x = p1.x - p1.grid_position_x * p1.width
                offset_y = p1.y - p1.grid_position_y * p1.height
                for p in b2.pieces:
                    p.block_id = b1.id
                    p.x = offset_x + p.grid_position_x * p1.width
                    p.y = offset_y + p.grid_position_y * p1.height
                    session.add(p)

                b1.weight += b2.weight

                k = len(b1.pieces) + len(b2.pieces)
                b1.center_x = sum(p.x for p in b1.pieces + b2.pieces) / k + b1.pieces[0].width / 2
                b1.center_y = sum(p.y for p in b1.pieces + b2.pieces) / k + b1.pieces[0].height / 2

                session.add(b1)
                session.query(DraggingUser) \
                    .where(or_(DraggingUser.block_id == b1.id,
                               DraggingUser.block_id == b2.id)).delete()
                session.add_all((b1, *b1.pieces))
                session.commit()
                session.delete(b2)
                session.commit()
                return True
    return False


def get_state():
    session.query(DraggingUser).filter(datetime.now() > DraggingUser.expires).delete()
    blocks: list[PuzzleBlock] = session.query(PuzzleBlock).all()

    b1: PuzzleBlock
    b2: PuzzleBlock
    for b1, b2 in itertools.combinations(blocks, 2):
        if try_merge(b1, b2):
            blocks.remove(b2)

    return {
        "blocks": [block.to_json() for block in blocks]
    }
