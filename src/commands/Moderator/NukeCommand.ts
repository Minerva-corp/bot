import { MinervaCommand } from '#structures/MinervaCommand';
import { channelMention } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { GuildChannel, MessageActionRow, MessageButton } from 'discord.js';

@ApplyOptions<MinervaCommand['options']>({
	name: 'nuke',
	description: '💥Nuke a some channel',
	requiredClientPermissions: ['MANAGE_CHANNELS'],
	requiredUserPermissions: ['MANAGE_CHANNELS'],
	chatInputCommand: {
		register: true,
		messageCommand: true,
		options: [
			{
				name: 'channel',
				description: 'The channel to nuke',
				type: 'CHANNEL',
				channelTypes: ['GUILD_TEXT'],
				required: true
			}
		]
	}
})
export class NukeCommand extends MinervaCommand {
	public override async chatInputRun(interaction: MinervaCommand.Interaction) {
		const channel = interaction.options.getChannel('channel') as GuildChannel;
		const confirm = new MessageButton().setStyle('SUCCESS').setLabel('Confirm').setCustomId('confirm');
		const cancel = new MessageButton().setStyle('DANGER').setLabel('Cancel').setCustomId('cancel');

		const action = new MessageActionRow().addComponents([confirm, cancel]);

		await interaction.reply({ content: `Are you sure you want to **__Nuke__** ${channelMention(channel.id)}?`, components: [action] });
		const filter = (i: { user: { id: string } }) => i.user.id === interaction.user.id;
		const collector = interaction.channel?.createMessageComponentCollector({ filter });

		collector?.on('collect', async (_i) => {
			if (_i.customId === 'cancel') {
				action.components[0].setDisabled(true);
				action.components[1].setDisabled(true);
				_i.update({ content: `Nuke action was canceled successfully!`, components: [action] });
			} else if (_i.customId === 'confirm') {
				await channel?.delete().catch((error: any) => {
					console.log(error);
				});

				// @ts-ignore
				const cloneText = await channel.clone();
				action.components[0].setDisabled(true);
				action.components[1].setDisabled(true);
				_i.update({ content: `${cloneText} was nuked successfully!`, components: [action] });
				cloneText
				// @ts-ignore
					.send({
						content: `\`${interaction.user.tag}\` nuked this channel.\nhttps://tenor.com/view/huge-explosion-boom-explosive-gif-16819858`
					})
					.then((msg: { delete: () => void; }) => {
						/** eslint-disable-next-line no-restricted-globals */
						setTimeout(() => {
							msg.delete();
						}, 5000);
					});
			}
		});
	}
}
