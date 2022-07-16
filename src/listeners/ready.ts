import { Listener, Events } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { env } from '#root/config';
import { createConnection } from 'typeorm';
import { GuildEntities, AfkEntities } from '#database/entities/index';
import type { Presence } from 'discord.js';

@ApplyOptions<Listener.Options>({ once: true })
export class ReadyListener extends Listener<typeof Events.ClientReady> {
	public async run() {
		await createConnection({
			type: 'mongodb',
			database: env.MONGO_DATABASE,
			entities: [GuildEntities, AfkEntities],
			url: env.MONGO_URL,
			useUnifiedTopology: true
		})
			.catch((error: any) => {
				this.container.client.logger.error('DATABASE_UNHADLE_ERROR', error);
			})
			.then((i: any) => {
				for (const databaseLength of Object.values(this.container.client.databases)) {
					databaseLength._initRepo();
					this.doPresence();
					continue;
				}
				return i;
			});
	}

	private async formatString(text: string): Promise<string> {
        let newText = text;

        if (text.includes("{userCount}")) {
            const users = await this.client.utils.getUserCount();

            newText = newText.replace(/{userCount}/g, users.toString());
        }
        if (text.includes("{textChannelsCount}")) {
            const textChannels = await this.client.utils.getChannelCount(true);

            newText = newText.replace(/{textChannelsCount}/g, textChannels.toString());
        }
        if (text.includes("{serverCount}")) {
            const guilds = await this.client.utils.getGuildCount();

            newText = newText.replace(/{serverCount}/g, guilds.toString());
        }

		if (text.includes("{whatDays}")) {
            newText = newText.replace(/{whatDays}/g, (await this.getDays()).toString());
        }

        return newText
            .replace(/{prefix}/g, env.PREFIX)
            .replace(/{username}/g, this.client.user!.username);
    }

    private async setPresence(random: boolean): Promise<Presence> {
        const activityNumber = random
            ? Math.floor(Math.random() * this.client.config.presenceData.activities.length)
            : 0;
        const statusNumber = random
            ? Math.floor(Math.random() * this.client.config.presenceData.status.length)
            : 0;
        const activity = (await Promise.all(
            this.client.config.presenceData.activities.map(
                async a => Object.assign(a, { name: await this.formatString(a.name!) })
            )
        ))[activityNumber];

        return this.client.user!.setPresence({
            activities: (activity as { name: string } | undefined) ? [activity] : [],
            status: this.client.config.presenceData.status[statusNumber]
        });
    }

	private async getDays() {
		const date = new Date()
		const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

		return days[date.getDay()];
	}

    private async doPresence(): Promise<Presence | undefined> {
        try {
            return await this.setPresence(false);
        } catch (e) {
            if ((e as Error).message !== "Shards are still being spawned.") {
                this.client.logger.error(String(e));
            }
            return undefined;
        } finally {
            setInterval(() => this.setPresence(true), this.client.config.presenceData.interval);
        }
    }
}
