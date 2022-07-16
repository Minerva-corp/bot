import type { Snowflake } from 'discord.js';
import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'afk' })
export class AfkEntities {
	@ObjectIdColumn()
	public _id!: ObjectID;

	@PrimaryColumn('string')
	public UserguildID!: Snowflake;

	@Column('string')
	public UserAfk!: Snowflake;

	@Column('boolean')
	public isAfk!: boolean;

    @Column('string')
    public AfkReason!: string;

    @Column('date')
    public AfkDate!: string;
}