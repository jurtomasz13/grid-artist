import { Repository } from 'typeorm';
import { Cell } from './cell.entity';

export class CellRepository extends Repository<Cell> {
	async updateColor(position: number, color: string): Promise<void> {
		await this.createQueryBuilder()
			.update(Cell)
			.set({ color })
			.where('position = :position', { position })
			.execute();
	}

	async findAll(): Promise<Cell[]> {
		return this.find();
	}
}
