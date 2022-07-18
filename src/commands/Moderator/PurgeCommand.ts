import { CommandContext } from "#root/lib/structures/CommandContext";
import { MinervaCommand } from "#root/lib/structures/MinervaCommand";
import { CatNo, PepeYes } from "#root/lib/types/declarations/emotes";
import { ApplyOptions } from "@sapphire/decorators";
import type { GuildTextBasedChannel, Message } from "discord.js";

@ApplyOptions<MinervaCommand['options']>({
    name: 'purge',
    description: 'Clear the message',
    aliases: ['clear', 'prune', 'deletemessage'],
    requiredUserPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES']
})

export class PurgeCommand extends MinervaCommand {
    public override async messageRun(message: Message, args: MinervaCommand.Args) {
        return this.run(new CommandContext(message, args));
    }

    private async run(ctx: CommandContext): Promise<any> {
        const messageToDeleteArgs =  await ctx.args?.pickResult("number");

        if(!messageToDeleteArgs?.value) return ctx.sendTemporaryMessage({ content: `${CatNo} -  You must input the **clear** to clear the message.` }) ;
        if(messageToDeleteArgs?.value! > 100) return ctx.sendTemporaryMessage({ content: `${CatNo} - You can't clear __${messageToDeleteArgs?.value}__ because is higher under 100` })

        if(ctx.channel?.isText() && ctx.context.inGuild()) {
            const channel = ctx.channel as GuildTextBasedChannel;
            const deletedMessage = await channel.bulkDelete(messageToDeleteArgs?.value ?? 10, true);

            await ctx.sendTemporaryMessage({ content: `${PepeYes} - Successfully clear **__${deletedMessage.size}__** messages!` });
        }
    }
}