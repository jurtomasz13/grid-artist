import { IsHexColor, validateOrReject } from 'class-validator';
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Cell {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	position: number;

	@Column()
	@IsHexColor()
	color: string;

	@BeforeInsert()
	@BeforeUpdate()
	async validateColor() {
		await validateOrReject(this);
	}
}
