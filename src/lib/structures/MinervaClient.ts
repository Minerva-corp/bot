import { LogLevel, SapphireClient } from '@sapphire/framework';
import * as BotConfig from '#root/config';
import type { BitFieldResolvable, IntentsString, PartialTypes } from 'discord.js';
import { GuildRepository } from '#database/repository/index';

export class MinervaClient extends SapphireClient {
	public config = BotConfig;

	public override databases = {
		guilds: new GuildRepository()
	};

	public constructor(options: clientOptions) {
		super({
			intents: options.intents,
			allowedMentions: { users: [], roles: [], repliedUser: false },
			fetchPrefix: async (p) => (await this.databases.guilds.get(p.guildId!)).prefix,
			logger: { level: BotConfig.env.isProduction ? LogLevel.Info : LogLevel.Debug },
			partials: options.partials,
			loadDefaultErrorListeners: false,
			loadMessageCommandListeners: true
		});
	}

	public isOwner(id: string): boolean {
		return BotConfig.BOT_OWNER.includes(id);
	}

	public async start(): Promise<void> {
		await this.login(this.config.env.DISCORD_TOKEN);
		this.logger.debug('Try to login to the bot.');
	}
}

interface clientOptions {
	intents: BitFieldResolvable<IntentsString, number>;
	partials?: PartialTypes[] | undefined;
}

declare module '@sapphire/framework' {
	export interface SapphireClient {
		databases: {
			guilds: GuildRepository;
		};
	}
}
