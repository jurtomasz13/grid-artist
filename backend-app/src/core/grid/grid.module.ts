import { Module } from '@nestjs/common';
import { CellModule } from '@/core/grid/cell/cell.module';
import { GridService } from './grid.service';
import { GridGateway } from './grid.gateway';

@Module({
	imports: [CellModule],
	providers: [GridService, GridGateway],
	exports: [CellModule, GridService],
})
export class GridModule {}
