import { Module } from '@nestjs/common';
import { CellService } from './cell.service';
import { CellRepositoryService } from './cell-repository.service';

@Module({
	providers: [CellService, CellRepositoryService],
	exports: [CellService],
})
export class CellModule {}
