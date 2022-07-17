import { CommandContext } from '#root/lib/structures/CommandContext';
import { InviteIcon } from '#root/lib/types/declarations/emotes';
import { createEmbed } from '#root/lib/utils/createEmbed';
import { MinervaCommand } from '#structures/MinervaCommand';
import { ApplyOptions } from '@sapphire/decorators';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { Message, MessageActionRow, MessageButton } from 'discord.js';

@ApplyOptions<MinervaCommand['options']>({
	name: 'invite',
	description: '.🔗 Get invitation link of the Bot',
	chatInputCommand: {
		register: true,
		messageCommand: true
	}
})
export class InviteCommand extends MinervaCommand {
	public messageRun(message: Message): any {
        return this.run(new CommandContext(message));
    }

    public chatInputRun(interaction: MinervaCommand.Interaction<"cached">): any {
        return this.run(new CommandContext(interaction));
    }

	private getButton() {
		const invite = this.client.generateInvite({
			permissions: [
				PermissionFlagsBits.Administrator,
				PermissionFlagsBits.ViewChannel,
				PermissionFlagsBits.SendMessages,
				PermissionFlagsBits.CreatePublicThreads,
				PermissionFlagsBits.CreatePrivateThreads,
				PermissionFlagsBits.EmbedLinks,
				PermissionFlagsBits.AttachFiles
			],
			scopes: ['bot', 'applications.commands']
		});
		const buttons = new MessageActionRow().addComponents(new MessageButton().setURL(invite).setStyle('LINK').setLabel(`INVITE`).setEmoji('🔗'));
		return buttons;
	}

	private run(ctx: CommandContext): any {
		ctx.reply({ content: `${InviteIcon} - Click the button below for the invitation link`, components: [this.getButton()] })
	}
}
