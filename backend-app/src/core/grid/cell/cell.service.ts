import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ICellRepositoryService } from './interfaces/cell-repository-service.interface';

@Injectable()
export class CellService {
	constructor(
		@Inject('CellRedisRepositoryService')
		private readonly cellRepositoryService: ICellRepositoryService,
	) {}

	async setColor(position: number, color: string): Promise<void> {
		const cell = await this.cellRepositoryService.findOneCell(position);

		if (!cell) {
			throw new BadRequestException(
				`Cell at position ${position} does not exist.`,
			);
		}

		try {
			await this.cellRepositoryService.updateColor(position, color);
		} catch (error) {
			if (error instanceof Array && error[0].property === 'color') {
				throw new BadRequestException('Invalid hex color.');
			}
			throw error;
		}
	}

	// async getCells(): Promise<Cell[]> {
	// 	return this.cellRepositoryService.find();
	// }
}
