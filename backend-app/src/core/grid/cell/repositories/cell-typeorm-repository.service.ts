import { Repository } from 'typeorm';
import { Cell } from '../cell.entity';
import { ICellRepositoryService } from '../interfaces/cell-repository-service.interface';
import { Cell as TCell } from '../cell.types';
import { Injectable } from '@nestjs/common';

export const CellTypeORMRepositoryServiceToken = 'CellTypeORMRepositoryService';

@Injectable()
export class CellTypeORMRepositoryService
	extends Repository<Cell>
	implements ICellRepositoryService
{
	async findOneCell(position: number): Promise<Cell> {
		return this.findOne({ where: { position } });
	}

	async createMany(cells: TCell[]): Promise<void> {
		await this.createMany(cells);
	}

	async updateColor(position: number, color: string): Promise<void> {
		await this.createQueryBuilder()
			.update(Cell)
			.set({ color })
			.where('position = :position', { position })
			.execute();
	}

	async updateColors(cells: TCell[]): Promise<void> {
		await this.createQueryBuilder()
			.update(Cell)
			.set({ color: () => 'color' })
			.where('position IN (:...positions)', {
				positions: cells.map(({ position }) => position),
			})
			.execute();
	}

	async findAll(): Promise<Cell[]> {
		return this.find();
	}
}
