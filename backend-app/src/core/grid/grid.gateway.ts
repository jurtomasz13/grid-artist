import { Cron } from '@nestjs/schedule';
import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Cell } from './cell/cell.types';
import { CreateCellDto } from './cell/cell.dto';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { BadRequestTransformationFilter } from '../filters/BadRequestTransformationFilter';
import { ConfigService } from '@nestjs/config';
import { AppConfigGridEnum } from '../configuration/configuration.enum';

@WebSocketGateway()
@UseFilters(new BadRequestTransformationFilter())
@UsePipes(new ValidationPipe({ transform: true }))
export class GridGateway {
	@WebSocketServer()
	private server: Server;
	private cellChanges: Map<string | number, Cell> = new Map<
		string | number,
		Cell
	>();
	private readonly MAX_CELL_CHANGES: number;

	constructor(private readonly configService: ConfigService) {
		this.MAX_CELL_CHANGES = this.configService.get<number>(
			AppConfigGridEnum.MAX_CELL_CHANGES,
		);
	}

	@Cron('*/2 * * * * *')
	sendGridChanges() {
		if (this.cellChanges.size <= 0) return;

		this.server.emit('gridChanges', Array.from(this.cellChanges.values()));
		this.cellChanges.clear();
	}

	@SubscribeMessage('changeCell')
	changeCell(@MessageBody() cell: CreateCellDto) {
		this.cellChanges.set(cell.position, cell);

		if (this.cellChanges.size > this.MAX_CELL_CHANGES) {
			this.sendGridChanges();
		}
	}
}
