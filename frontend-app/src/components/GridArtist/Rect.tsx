import { Rect as KonvaRect } from "react-konva";
import { ComponentProps, Dispatch, FC, SetStateAction, useEffect, useState } from "react";

type RectFill = string | CanvasGradient | undefined;

type RectProps = {
	position: number;
	rectSetColorMap: Map<string | number, Dispatch<SetStateAction<RectFill>>>;
} & ComponentProps<typeof KonvaRect>;

export const Rect: FC<RectProps> = (({ rectSetColorMap, position, fill, onClick, onDblClick, ...rest }) => {
	const [color, setColor] = useState(fill);

	useEffect(() => {
		rectSetColorMap.set(position, setColor);
	}, [rectSetColorMap, setColor, position]);

	return (
		<KonvaRect
			fill={color}
			onClick={onClick}
			onDblClick={onDblClick}
			{...rest}
		/>
	)
});