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

	async getCells(): Promise<Cell[]> {
		return this.cellsRepositoryService.findAll();
	}

	async updateGrid(cells: Cell[]): Promise<void> {}

	async initializeEmptyGrid(): Promise<void> {
		const batchSize = 50;
		const gridSize = this.configService.get<number>(AppConfigGridEnum.SIZE);

		let cells = [];
		for (let i = 0; i < batchSize; i++) {
			cells.push({
				position: i,
				color: '#ffffff',
			});
		}

		for (let i = 0; i < gridSize / batchSize; i++) {
			for (let j = 0; j < batchSize; j++) {
				cells[i].position += batchSize * j;
				console.log(cells[j].position);
			}

			await this.cellsRepositoryService.createMany(cells);
		}

		console.log('Empty grid initialized!');
	}
}
