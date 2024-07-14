import { IsInt, Min, IsHexColor } from 'class-validator';

export class CreateCellDto {
	@IsInt({ message: 'Position must be an integer.' })
	@Min(0, { message: 'Position must be greater than or equal to 0.' })
	position: number;

	@IsHexColor({ message: 'Invalid hex color.' })
	color: string;
}
