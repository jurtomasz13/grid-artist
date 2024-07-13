import { IsInt, Min, IsHexColor } from 'class-validator';

export class CreateCellDto {
	@IsInt()
	@Min(0)
	position: number;

	@IsHexColor()
	color: string;
}
