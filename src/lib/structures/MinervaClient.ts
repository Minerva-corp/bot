import { LogLevel, SapphireClient } from '@sapphire/framework';
import * as BotConfig from '#root/config';
import type { BitFieldResolvable, IntentsString, PartialTypes } from 'discord.js';
import { GuildRepository, AfkRepository } from '#database/repository/index';
import { ClientUtils } from '#utils/client-utils';

export class MinervaClient extends SapphireClient {
	public override config = BotConfig;

	public override utils = new ClientUtils(this);

	public override databases = {
		guilds: new GuildRepository(),
		afk: new AfkRepository()
	};

	public constructor(options: clientOptions) {
		super({
			ws: {
				properties: {
					browser: 'Discord iOS'
				}
			},
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
		utils: ClientUtils;
		config: typeof BotConfig;
		databases: {
			guilds: GuildRepository;
			afk: AfkRepository;
		};
	}
}
