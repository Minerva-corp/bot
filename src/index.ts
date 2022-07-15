import '#utils/setup';
import { MinervaClient } from '#structures/MinervaClient';
import process from 'node:process';

const client = new MinervaClient({
	intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_BANS'],
	partials: ['MESSAGE', 'CHANNEL', 'GUILD_MEMBER']
});

try {
	await client.start();
} catch (error) {
	client.logger.fatal(error);
	client.destroy();

	/* eslint-disable-next-line unicorn/no-process-exit */
	process.exit(1);
}
