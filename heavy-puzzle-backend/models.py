from sqlalchemy import Integer, Column, Float, ForeignKey, String, DateTime
from sqlalchemy.orm import relationship

from app import Base, engine


class PuzzleBlock(Base):
    __tablename__ = "blocks"
    id = Column(Integer, primary_key=True)
    center_x = Column(Float, nullable=False)
    center_y = Column(Float, nullable=False)
    weight = Column(Integer, nullable=False)

    pieces: list["PuzzlePiece"] = relationship("PuzzlePiece", backref="block")
    dragging_users: list["DraggingUser"] = relationship("DraggingUser", backref="block")

    def to_json(self) -> dict:
        return {
            "id": self.id,
            "centerX": self.center_x,
            "centerY": self.center_y,
            "weight": self.weight,
            "pieces": [piece.to_json() for piece in self.pieces],
            "draggingUsers": [drag.to_json() for drag in self.dragging_users],
        }


class PuzzlePiece(Base):
    __tablename__ = "pieces"
    id = Column(Integer, primary_key=True)
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    width = Column(Integer, nullable=False)
    height = Column(Integer, nullable=False)
    image_url = Column(String, nullable=False)
    grid_position_x = Column(Integer, nullable=False)
    grid_position_y = Column(Integer, nullable=False)
    block_id = Column(Integer, ForeignKey(PuzzleBlock.id), nullable=False)

    def to_json(self) -> dict:
        return {
            "id": self.id,
            "x": self.x,
            "y": self.y,
            "width": self.width,
            "height": self.height,
            "imageUrl": self.image_url,
            "gridPositionX": self.grid_position_x,
            "gridPositionY": self.grid_position_y,
        }


class DraggingUser(Base):
    __tablename__ = "dragging"
    id = Column(String, primary_key=True)
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    expires = Column(DateTime, nullable=False)
    block_id = Column(Integer, ForeignKey(PuzzleBlock.id), nullable=False)

    def to_json(self) -> dict:
        return {
            "id": self.id,
            "x": self.x,
            "y": self.y,
        }


Base.metadata.create_all(engine)
