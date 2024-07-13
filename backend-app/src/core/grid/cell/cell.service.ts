import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CellRepository } from './cell-repository.service';
import { Cell } from './cell.entity';

@Injectable()
export class CellService {
	constructor(
		@InjectRepository(CellRepository)
		private readonly cellRepository: CellRepository,
	) {}

	async setColor(position: number, color: string): Promise<void> {
		const cell = await this.cellRepository.findOne({ where: { position } });

		if (!cell) {
			throw new BadRequestException(
				`Cell at position ${position} does not exist.`,
			);
		}

		cell.color = color;

		try {
			await this.cellRepository.save(cell);
		} catch (error) {
			if (error instanceof Array && error[0].property === 'color') {
				throw new BadRequestException('Invalid hex color.');
			}
			throw error;
		}
	}

	async getCells(): Promise<Cell[]> {
		return this.cellRepository.find();
	}
}
