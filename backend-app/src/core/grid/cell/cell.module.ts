import { Module } from '@nestjs/common';
import { CellService } from './cell.service';
import {
	CellTypeORMRepositoryService,
	CellTypeORMRepositoryServiceToken,
} from './repositories/cell-typeorm-repository.service';
import {
	CellRedisRepositoryService,
	CellRedisRepositoryServiceToken,
} from './repositories/cell-redis-repository.service';

@Module({
	providers: [
		CellService,
		{
			provide: CellTypeORMRepositoryServiceToken,
			useClass: CellTypeORMRepositoryService,
		},
		{
			provide: CellRedisRepositoryServiceToken,
			useClass: CellRedisRepositoryService,
		},
	],
	exports: [
		CellService,
		CellRedisRepositoryServiceToken,
		CellTypeORMRepositoryServiceToken,
	],
})
export class CellModule {}
