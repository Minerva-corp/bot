import { cleanEnv, str } from 'envalid';
import process from 'node:process';
import { parseEnvValue } from '#utils/parse-env';
import type { ActivityOptions, ClientPresenceStatus } from 'discord.js';

process.env.NODE_ENV ??= 'development';

export const env = cleanEnv(process.env, {
	DISCORD_TOKEN: str({ desc: 'The discord bot token' }),
	DEV_SERVER_ID: str({ default: '' }),
	MONGO_URL: str({ default: '' }),
	MONGO_DATABASE: str({ default: 'Minerva' }),
	PREFIX: str({ default: '!' })
});

export const presenceData: PresenceData = {
	activities: [
		{ name: '💘 - {userCount} & {serverCount}!', type: 'COMPETING' },
		{ name: 'Happy {whatDays}!', type: 'LISTENING' }
	],
	status: ['online'],
	interval: 60_000
};

export const BOT_OWNER: string[] = parseEnvValue(process.env.DEV_ID ?? '');
export const SUPPORT_SERVER = 'https://discord.gg/2QBe96yg';

interface PresenceData {
	activities: ActivityOptions[];
	status: ClientPresenceStatus[];
	interval: number;
}
