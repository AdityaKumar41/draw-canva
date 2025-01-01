type Point = {
  x: number;
  y: number;
};

type Draw = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
};

export interface DrawWithColorAndWidth extends Draw {
  color: string;
  newlineWidth: number;
}

export type DrawLineProps = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
  newlineWidth: number;
};
