import { Listener, Events } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { env } from '#root/config';
import { createConnection } from 'typeorm';
import { GuildEntities } from '#database/entities/index';

@ApplyOptions<Listener.Options>({ once: true })
export class ReadyListener extends Listener<typeof Events.ClientReady> {
	public async run() {
		await createConnection({
			type: 'mongodb',
			database: env.MONGO_DATABASE,
			entities: [GuildEntities],
			url: env.MONGO_URL,
			useUnifiedTopology: true
		})
			.catch((error: any) => {
				this.container.client.logger.error('DATABASE_UNHADLE_ERROR', error);
			})
			.then((i: any) => {
				for (const databaseLength of Object.values(this.container.client.databases)) {
					databaseLength._initRepo();
					continue;
				}
				return i;
			});
	}
}
