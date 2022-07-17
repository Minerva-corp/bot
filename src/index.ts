import '#utils/setup';
import { MinervaClient } from '#structures/MinervaClient';
import process from 'node:process';

const client = new MinervaClient({
	intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_BANS'],
	partials: ['MESSAGE', 'CHANNEL', 'GUILD_MEMBER']
});

process.on('unhandledRejection', error => {
	client.logger.error('Unhandled promise rejection:', error);
});

process.on('rejectionHandled', error => {
	client.logger.error('rejectionHandled promise rejection:', error);
})

process.on('uncaughtException', error => {
	client.logger.fatal('uncaughtException promise rejection:', error);
})

process.on('uncaughtExceptionMonitor', error => {
	client.logger.error('uncaughtExceptionMonitor promise rejection:', error);
})

try {
	await client.start();
} catch (error) {
	client.logger.fatal(error);
	client.destroy();

	/* eslint-disable-next-line unicorn/no-process-exit */
	process.exit(1);
}
