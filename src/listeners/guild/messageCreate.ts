import { KittyHello } from "#root/lib/types/declarations/emotes";
import { Events, Listener } from "@sapphire/framework";
import type { Message } from "discord.js";

export default class extends Listener<typeof Events.MessageCreate> {
    public async run(message: Message) {
        let userId = message.author.id;
        let data = await this.client.databases.afk.get(message.guildId as string, userId as string);
        if(data && data.isAfk) {
            await this.client.databases.afk.delete(message.guildId as string, userId as string);
            await message.reply(`${KittyHello} Welcome a back from your afk, ${message.author.username}!`)
        }

        const target = message.mentions.members?.first();
        if(target) {
            userId = target?.id;
            data = await this.client.databases.afk.get(message.guildId as string, userId as string);
            if(!data) return;
            await message.reply(`**${target.nickname}** is currently AFK - [<t:${Math.floor(parseInt(data.AfkDate) / 1000)}:R>]. ${data.AfkReason}`);
        }
    }
}