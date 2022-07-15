import type { Snowflake } from 'discord.js';
import { getMongoRepository, MongoRepository } from 'typeorm';
import { GuildEntities } from '#database/entities/GuildEntities';

export class GuildRepository {
	public repository!: MongoRepository<GuildEntities>;
	public _initRepo() {
		this.repository = getMongoRepository(GuildEntities);
	}

	public async get(guild: Snowflake): Promise<GuildEntities> {
		const data = (await this.repository.findOne({ where: { guild } })) ?? this.repository.create({ guild });
		await this.repository.save(data);
		return data;
	}

	public async set(guild: Snowflake, key: keyof GuildEntities, value: any): Promise<GuildEntities> {
		const data = (await this.repository.findOne({ where: { guild } })) ?? this.repository.create({ guild });

		data[key] = value;
		await this.repository.save(data);
		return data;
	}
}
