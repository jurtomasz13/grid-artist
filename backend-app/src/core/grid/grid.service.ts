import { Inject, Injectable } from '@nestjs/common';
import { Cell } from '@/core/grid/cell/cell.types';
import { ICellRepositoryService } from './cell/interfaces/cell-repository-service.interface';
import { ConfigService } from '@nestjs/config';
import { AppConfigGridEnum } from '../configuration/configuration.enum';
import { CellRedisRepositoryServiceToken } from './cell/repositories/cell-redis-repository.service';

@Injectable()
export class GridService {
	constructor(
		private readonly configService: ConfigService,
		@Inject(CellRedisRepositoryServiceToken)
		private readonly cellsRepositoryService: ICellRepositoryService,
	) {}

	async getGrid(): Promise<Cell[]> {
		return this.cellsRepositoryService.findAll();
	}

	async updateGrid(cells: Cell[]): Promise<void> {
		await this.cellsRepositoryService.updateColors(cells);
	}

	async initializeEmptyGrid(): Promise<void> {
		const gridSize = this.configService.get<number>(AppConfigGridEnum.SIZE);
		const batchSize = 50;

		const hasLastElement = this.cellsRepositoryService.findOneCell(
			gridSize - 1,
		);

		const hasMoreElements = this.cellsRepositoryService.findOneCell(gridSize);

		if (hasMoreElements) {
			console.log('Grid size has changed! Clearing grid...');
		}

		if (!hasMoreElements && hasLastElement) {
			console.log('Grid has already been initialized!');
			return;
		}

		await this.cellsRepositoryService.clearDb();

		console.log('Initializing empty grid...');
		for (let i = 0; i < Math.ceil(gridSize / batchSize); i++) {
			let cells = [];
			for (let j = 0; j < batchSize; j++) {
				const position = i * batchSize + j;
				if (position >= gridSize) break; // Avoid adding extra cells beyond the gridSize

				cells.push({
					position: position,
					color: '#ffffff',
				});
			}

			await this.cellsRepositoryService.createMany(cells);
		}

		console.log('Empty grid initialized!');
	}
}
