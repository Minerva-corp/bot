import { SadIcon } from '#root/lib/types/declarations/emotes';
import { Events, Listener } from '@sapphire/framework';
import { GuildMember, Interaction, MessageEmbed } from 'discord.js';

export class InteractionCreate extends Listener<typeof Events.InteractionCreate> {
	public async run(interaction: Interaction) {
		if (!interaction.isUserContextMenu()) {
			return;
		}
		const member = interaction.targetMember as GuildMember;

		if (!member) {
			return interaction.reply({ content: `${SadIcon} - That user was not found!` });
		}

		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor('GREY')
					.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
					.setImage(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
			]
		});
	}
}
