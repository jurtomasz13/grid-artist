import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Cell } from './cell/cell.types';
import { CreateCellDto } from './cell/cell.dto';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { BadRequestTransformationFilter } from '../filters/BadRequestTransformationFilter';
import { ConfigService } from '@nestjs/config';
import { AppConfigGridEnum } from '../configuration/configuration.enum';
import { GridService } from './grid.service';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
@UseFilters(new BadRequestTransformationFilter())
@UsePipes(new ValidationPipe({ transform: true }))
export class GridGateway
	implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
	@WebSocketServer()
	private readonly MAX_CELL_CHANGES: number;
	private server: Server;
	private cellChanges: Map<string | number, Cell> = new Map<
		string | number,
		Cell
	>();
	private connectedClients = 0;

	constructor(
		private readonly schedulerRegistry: SchedulerRegistry,
		private readonly configService: ConfigService,
		private readonly gridService: GridService,
	) {
		this.MAX_CELL_CHANGES = this.configService.get<number>(
			AppConfigGridEnum.MAX_CELL_CHANGES,
		);
	}

	afterInit(server: Server) {
		this.server = server;
	}

	async handleConnection(client: Socket, ..._args: any[]) {
		this.connectedClients++;
		const initialGrid = await this.gridService.getGrid();
		client.emit('initial-grid', initialGrid);
	}

	handleDisconnect(_client: any) {
		this.connectedClients--;
	}

	@Cron(CronExpression.EVERY_5_SECONDS)
	async info() {
		console.log(`Currently connected clients: ${this.connectedClients}`);
	}

	@Cron(CronExpression.EVERY_SECOND, { name: 'initialize-grid' })
	async initializeGrid() {
		this.schedulerRegistry.deleteCronJob('initialize-grid');
		await this.gridService.initializeEmptyGrid();
	}

	@Cron(CronExpression.EVERY_MINUTE)
	async sendGridChanges() {
		console.log('Updating grid changes...');
		if (this.cellChanges.size <= 0) return;

		const cellChangesArr = Array.from(this.cellChanges.values());
		await this.gridService.updateGrid(cellChangesArr);

		this.server.emit('grid-changes', cellChangesArr);
		this.cellChanges.clear();
	}

	@SubscribeMessage('update-cell')
	changeCell(@MessageBody() cell: CreateCellDto) {
		console.log('Update cell', cell);
		this.cellChanges.set(cell.position, cell);

		if (this.cellChanges.size > this.MAX_CELL_CHANGES) {
			this.sendGridChanges();
		}
	}
}
