import { InviteIcon } from '#root/lib/types/declarations/emotes';
import { MinervaCommand } from '#structures/MinervaCommand';
import { ApplyOptions } from '@sapphire/decorators';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { Message, MessageActionRow, MessageButton } from 'discord.js';

@ApplyOptions<MinervaCommand['options']>({
	name: 'invite',
	description: 'Get invitation link of the Bot',
	chatInputCommand: {
		register: true,
		messageCommand: true
	}
})
export class InviteCommand extends MinervaCommand {
	public override async messageRun(message: Message): Promise<void> {
		await message.reply({ content: `${InviteIcon} - Click the button below for the invitation link.`, components: [this.getButton()] });
	}

	public override async chatInputRun(interaction: MinervaCommand.Interaction): Promise<void> {
		await interaction.reply({ content: `${InviteIcon} - Click the button below for the invitation link.`, components: [this.getButton()] });
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
}
