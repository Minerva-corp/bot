import { Collection, type Snowflake } from 'discord.js';
import { getMongoRepository, MongoRepository } from 'typeorm';
import { AfkEntities } from '#database/entities/AfkEntities';

export class AfkRepository {
	public repository!: MongoRepository<AfkEntities>;
	public _initRepo() {
		this.repository = getMongoRepository(AfkEntities);
	}

	public cache: Collection<Snowflake, NodeJS.Timeout> = new Collection();

	public async get(UserguildID: Snowflake, UserAfk: Snowflake): Promise<AfkEntities | null> {
		const data = await this.repository.findOne({ where: { UserguildID, UserAfk } });
		return data;
	}

	public async set(UserguildID: Snowflake, UserAfk: Snowflake, key: keyof AfkEntities, value: any): Promise<AfkEntities> {
		const data = (await this.repository.findOne({ where: { UserguildID, UserAfk } })) ?? this.repository.create({ UserguildID, UserAfk });

		// @ts-ignore
		data[key] = value;
		await this.repository.save(data);
		return data;
	}

	public async delete(UserguildID: Snowflake, UserAfk: Snowflake) {
		const data = await this.repository.deleteOne({
			UserguildID,
			UserAfk
		});
		return data;
	}
}
