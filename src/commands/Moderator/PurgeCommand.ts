import { MinervaCommand } from "#root/lib/structures/MinervaCommand";
import { CatNo, PepeYes } from "#root/lib/types/declarations/emotes";
import { ApplyOptions } from "@sapphire/decorators";
import type { Message } from "discord.js";

@ApplyOptions<MinervaCommand['options']>({
    name: 'purge',
    description: 'clear the message',
    aliases: ['clear', 'prune', 'deletemessage'],
    requiredUserPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES']
})

export class PurgeCommand extends MinervaCommand {
    public override async messageRun(message: Message, args: MinervaCommand.Args) {
        const messageToDeleteArgs = await args.pickResult("number");

        if(messageToDeleteArgs.value! > 100) return this.client.utils.sendTemporaryMessage(message, `${CatNo} - You can't clear __${messageToDeleteArgs.value}__ because is higher under 100`, 6000);
        if (message.channel.isText() && message.inGuild()) {
            const deletedMessage = await message.channel.bulkDelete(messageToDeleteArgs.value ?? 10, true);
            await this.client.utils.sendTemporaryMessage(message, `${PepeYes} - Successfully clear **__${deletedMessage.size}__** messages!`, 6000);
        }
    }
}