import { FC, useEffect, useRef, useReducer, useCallback, useMemo, useState } from "react";
import { Layer, Stage } from "react-konva";
import { HexColorPicker } from "react-colorful";
import { Cell } from "./types";
import { KonvaEventObject } from "konva/lib/Node";
import { useGrid } from "../../hooks/useGrid";
import { Rect } from "./Rect";

type GridProps = {
  cellSize?: number;
  numCelles?: number;
};

type Action =
  | { type: 'UPDATE_BOX_COLOR'; id: number; color: string }
  | { type: 'SET_INITIAL_GRID'; grid: Map<number, Cell> };

const gridReducer = (state: Map<number, Cell>, action: Action): Map<number, Cell> => {
  switch (action.type) {
    case 'SET_INITIAL_GRID':
      return new Map(action.grid);
    default:
      return state;
  }
};

export const Grid: FC<GridProps> = ({ cellSize = 20, numCelles = 45 }) => {
  const gridCtx = useGrid();

  const [gridState, dispatchGrid] = useReducer(gridReducer, new Map());
	const [currentHexColor, setCurrentHexColor] = useState('#000000');

  const clickTimeoutRef = useRef<NodeJS.Timeout>();
	const rectSetColorMap = useRef(new Map());
	const currentHexColorRef = useRef(currentHexColor);

	useEffect(() => {
		console.log('Grid changes detected, updating grid');
		if (gridCtx.gridChanges.length > 0) {
			gridCtx.gridChanges.forEach((cell) => {
				rectSetColorMap.current.get(cell.position)(cell.color);
			});
		}
	}, [gridCtx.gridChanges]);

  useEffect(() => {
    const initialGrid = new Map<number, Cell>(
      Array.from({ length: numCelles * numCelles }, (_, index) => [
        index,
        {
          position: index,
          x: (index % numCelles) * cellSize,
          y: Math.floor(index / numCelles) * cellSize,
          width: cellSize,
          height: cellSize,
          color: '#ffffff',
        },
      ])
    );

    dispatchGrid({ type: 'SET_INITIAL_GRID', grid: initialGrid });
  }, [cellSize, numCelles]);

  useEffect(() => {
    gridCtx.initialGrid.forEach((color, position) => {
      rectSetColorMap.current.get(position)(color);
    });
  }, [gridCtx.initialGrid]);

  const handleClick = useCallback(
    (id: number) => {
      clearTimeout(clickTimeoutRef.current);

      const timeout = setTimeout(() => {
				rectSetColorMap.current.get(id)(currentHexColorRef.current);
				gridCtx.updateCell(id, currentHexColorRef.current);
      }, 200);

      clickTimeoutRef.current = timeout;
    },
    [gridCtx]
  );

	const handleColorChange = (color: string) => {
		setCurrentHexColor(color);
		currentHexColorRef.current = color;
	}

  const handleColorExtraction = useCallback(
    (event: KonvaEventObject<MouseEvent>) => {
      clearTimeout(clickTimeoutRef.current);
      const color = event.target.attrs.fill;

      if (color) {
        setCurrentHexColor(color);
				currentHexColorRef.current = color;
      } else {
        console.error('Invalid color');
      }
    },
    []
  );

  const memoizedGrid = useMemo(() => 
    Array.from(gridState.values()).map((cell, index) => cell ? (
      <Rect
				key={index}
				position={index}
        rectSetColorMap={rectSetColorMap.current}
        x={cell.x}
        y={cell.y}
        width={cell.width}
        height={cell.height}
        fill={cell.color}
        stroke="black"
        onClick={() => handleClick(index)}
        onDblClick={handleColorExtraction}
      />
    ) : null)
  , [gridState, handleClick, handleColorExtraction]);

  return (
    <div style={{ display: 'flex' }}>
      <HexColorPicker color={currentHexColor} onChange={handleColorChange} />
      <Stage width={cellSize * numCelles} height={cellSize * numCelles}>
        <Layer>
          {memoizedGrid}
        </Layer>
      </Stage>
    </div>
  );
};