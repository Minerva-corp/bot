import { CommandContext } from "#root/lib/structures/CommandContext";
import { MinervaCommand } from "#root/lib/structures/MinervaCommand";
import { CatNo, PepeYes } from "#root/lib/types/declarations/emotes";
import { ApplyOptions } from "@sapphire/decorators";
import { Collection, GuildTextBasedChannel, Message } from "discord.js";

@ApplyOptions<MinervaCommand['options']>({
    name: 'purge',
    description: 'Clear the message',
    aliases: ['clear', 'prune', 'deletemessage'],
    requiredUserPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
    chatInputCommand: {
        register: true,
        messageCommand: true,
        options: [
            {
                name: 'size',
                description: 'The cleared messaged size default is 10',
                type: 'NUMBER',
                required: false
            }
        ]
    }
})

export class PurgeCommand extends MinervaCommand {
    public override async messageRun(message: Message, args: MinervaCommand.Args) {
        return this.run(new CommandContext(message, args));
    }

    public override async chatInputRun(interaction: MinervaCommand.Interaction<"cached">) {
        return this.run(new CommandContext(interaction))
    }

    private async run(ctx: CommandContext): Promise<any> {
        const messageToDeleteArgs = await ctx.args?.restResult('string');
        if(!messageToDeleteArgs?.success && !ctx.options) return ctx.sendTemporaryMessage({ content: `${CatNo} -  You must input the **clear** to clear the message.` }, 8000);
        const messageDelete = messageToDeleteArgs?.value ?? ctx.options?.getNumber("size", false);

        if(messageDelete! > 100) return ctx.sendTemporaryMessage({ content: `${CatNo} - You can't clear __${messageToDeleteArgs}__ because is higher under 100` })

        
        if(ctx.channel?.isText() && ctx.context.inGuild()) {
            const channel = ctx.channel as GuildTextBasedChannel;
            const deletedMessage = await channel.bulkDelete(messageDelete as number ?? 10, true);

            await ctx.sendTemporaryMessage({ content: `${PepeYes} - Successfully clear **__${deletedMessage.size}__** messages!` });
        }
    }

    public transformToCollection(array: Message[]) {
        const temporaryCollection: Collection<string, Message> = new Collection();
        for (const data of array) {
            temporaryCollection.set(data.id, data);
            continue;
        }
        return temporaryCollection;
    }
}