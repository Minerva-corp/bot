import { CatNo, PepeYes } from "#root/lib/types/declarations/emotes";
import { MinervaCommand } from "#structures/MinervaCommand";
import { ApplyOptions } from "@sapphire/decorators";
import type { Message } from "discord.js";

@ApplyOptions<MinervaCommand['options']>({
    name: "afk",
    description: "Sets you status to AFK."
})

export class AfkCommand extends MinervaCommand {
    public override async messageRun(message: Message, args: MinervaCommand.Args) {
        const data = await this.client.databases.afk.get(message.guildId as string, message.author.id as string);
        const reason = await args.pickResult('string')

        if(data && data.isAfk) return message.reply(`${CatNo} - You're already __AFK__!`)

        if(message.member?.manageable) { message.member.setNickname(`[AFK] ${message.author.username}`) }
    
        await this.client.databases.afk.set(message.guildId as string, message.author.id as string, 'isAfk', true)
        await this.client.databases.afk.set(message.guildId as string, message.author.id as string, 'AfkReason', reason.value || 'No Reason')
        await this.client.databases.afk.set(message.guildId as string, message.author.id as string, 'AfkDate', Date.now())
        await message.reply(`${PepeYes} - You're has been setted AFK Succesfully. Reason: ${reason.value}`)
        return;
    }
}