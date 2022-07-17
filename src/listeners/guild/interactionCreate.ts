import { SadIcon } from '#root/lib/types/declarations/emotes';
import { createEmbed } from '#root/lib/utils/createEmbed';
import { Events, Listener } from '@sapphire/framework';
import { BitFieldResolvable, Permissions, GuildMember, Interaction, MessageEmbed, PermissionString } from 'discord.js';

export class InteractionCreate extends Listener<typeof Events.InteractionCreate> {
	public async run(interaction: Interaction) {
		if (interaction.isUserContextMenu()) {
			switch(interaction.commandName) {
				case 'avatar': {
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
		}
		
		if (interaction.isButton()) {
			const val = this.client.utils.decode(interaction.customId);
            const user = val.split("_")[0] ?? "";
            const cmd = val.split("_")[1] ?? "";

            if (cmd === "delete-msg") {
                if (
                    interaction.user.id !== user &&
                    !new Permissions(
                        interaction.member?.permissions as BitFieldResolvable<PermissionString, bigint> | undefined
                    ).has("MANAGE_MESSAGES")
                ) {
                    void interaction.reply({
                        ephemeral: true,
                        embeds: [
                            createEmbed(
                                "error",
                                `Sorry, you can't use this commands because this is only for **server staff**.`,
                                true
                            )
                        ]
                    });
                } else {
                    const msg = await interaction.channel?.messages.fetch(interaction.message.id).catch(() => null);
                    if (msg?.deletable) {
                        void msg.delete();
                    }
                }
            }
		}
	}
}
