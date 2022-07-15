import { env } from '#root/config';
import type { Snowflake } from 'discord.js';
import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'guild' })
export class GuildEntities {
	@ObjectIdColumn()
	public _id!: ObjectID;

	@PrimaryColumn('string')
	public guild!: Snowflake;

	@Column('string')
	public prefix = env.PREFIX;
}
