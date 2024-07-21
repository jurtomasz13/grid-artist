import { RedisService } from '@/core/redis/redis.service';
import { ICellRepositoryService } from '../interfaces/cell-repository-service.interface';
import { Cell } from '../cell.types';
import { Injectable } from '@nestjs/common';

export const CellRedisRepositoryServiceToken = 'CellRedisRepositoryService';

@Injectable()
export class CellRedisRepositoryService implements ICellRepositoryService {
	constructor(private readonly redisService: RedisService) {}

	async updateColor(position: number, color: string): Promise<void> {
		await this.redisService.setValue(`cells:${position}`, color);
	}

	async updateColors(cells: Cell[]): Promise<void> {
		const parsedCells = cells.map(({ position, color }) => ({
			key: `cells:${position}`,
			value: color,
		}));

		await this.redisService.batchSetValue<string>(parsedCells);
	}

	async findAll() {
		const rawCells = await this.redisService.getAllValues('cells:*');
		const cells = rawCells.map((cell) => JSON.parse(cell)) as Cell[];
		return cells;
	}

	async findOneCell(position: number) {
		const rawCell = await this.redisService.getValue(`cells:${position}`);
		const cell = JSON.parse(rawCell) as Cell;
		return cell;
	}

	async createMany(cells: Cell[]) {
		const parsedCells = cells.map(({ position, color }) => ({
			key: `cells:${position}`,
			value: color,
		}));

		await this.redisService.batchSetValue<string>(parsedCells);
	}

	async clearDb(): Promise<void> {
		await this.redisService.clearDb();
	}
}
