import { FC, useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { HexColorPicker } from "react-colorful";
import { useGrid } from "../hooks/useGrid";

type Box = {
	id: number;
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;
};

export type GridProps = {
	boxSize?: number;
	numBoxes?: number;
}

export const Grid: FC<GridProps> = ({
	boxSize = 20,
	numBoxes = 45,
}) => {
	const gridCtx = useGrid();
	const clickTimeoutRef = useRef<NodeJS.Timeout>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, refresh] = useState({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [boxes, _setBoxes] = useState<Map<number, Box>>(
		new Map(Array.from({ length: numBoxes * numBoxes }, (_, i) => (
			[
				i,
				{
					id: i,
					x: (i % numBoxes) * boxSize,
					y: Math.floor(i / numBoxes) * boxSize,
					width: boxSize,
					height: boxSize,
					color: '#ffffff',
				}
			]
		)))
	);
	
	useEffect(() => {
		if (gridCtx.initialGrid.length > 0) {
			gridCtx.initialGrid.forEach((cell, position) => {
				const box = boxes.get(position);

				if (!box) {
					console.log('Box not found');
					return;
				}

				boxes.set(position, {
					...box,
					color: cell.color,
				});
			});

			refresh({});
		}
	}, [gridCtx.initialGrid, boxes]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentColor, setCurrentColor] = useState('#000000');

  const handleClick = (id: number) => {
		clearTimeout(clickTimeoutRef.current);

		const timeout = setTimeout(() => {
			changeBoxColor(id);
			gridCtx.updateCell(id, currentColor);
		}, 200);

		clickTimeoutRef.current = timeout;
  };

	const changeBoxColor = (id: number, color?: string) => {
		const box = boxes.get(id);

		if (!box) {
			console.log('Box not found');
			return;
		}
		
		boxes.set(id, { 
			...box,
			color: color ? color : currentColor 
		});

		refresh({});
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleColorChange = (event: any) => {
		clearTimeout(clickTimeoutRef.current);
		const color = event.target.attrs.fill;

		if (!color) {
			console.error('Invalid color');
			return;
		}

		setCurrentColor(color);
	}

	return (
    <div style={{ display: 'flex' }}>
			<HexColorPicker color={currentColor} onChange={setCurrentColor} />
      <Stage  width={boxSize * numBoxes} height={boxSize * numBoxes}>
        <Layer>
          {Array.from(boxes.values()).map((box) => (
            <Rect
              key={box.id}
              x={box.x}
              y={box.y}
              width={box.width}
              height={box.height}
              fill={box.color}
              stroke="black"
              onClick={() => handleClick(box.id)}
							onDblClick={(handleColorChange)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}