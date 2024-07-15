import { Cell } from '../cell.types';

export interface ICellRepositoryService {
	createMany(cells: Cell[]): Promise<void>;
	findAll(): Promise<Cell[]>;
	findOneCell(position: number): Promise<Cell>;
	updateColor(position: number, color: string): Promise<void>;
	updateColors(cells: Cell[]): Promise<void>;
}
