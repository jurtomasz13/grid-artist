import { Module } from '@nestjs/common';
import { CellModule } from '@/core/grid/cell/cell.module';
import { GridService } from './grid.service';

@Module({
	imports: [CellModule],
	providers: [GridService],
	exports: [CellModule, GridService],
})
export class GridModule {}
