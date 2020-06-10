import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'guilds' })
export class GuildEntity {
	@PrimaryColumn()
	public id!: string;

	@Column({ 'default': 'r!' })
	public prefix!: string;

	@Column({ 'default': 'GG {player}, you just advanced to level {level}!' })
	public format!: string;

	@Column({ 'type': 'json', 'default': {} })
	public roles!: { [roleID: string]: number };
}
