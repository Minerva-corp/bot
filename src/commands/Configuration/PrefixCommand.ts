import { createEmbed } from '#root/lib/utils/createEmbed';
import { MinervaCommand } from '#structures/MinervaCommand';
import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<MinervaCommand['options']>({
	name: 'prefix',
	requiredUserPermissions: ['MANAGE_GUILD'],
	requiredClientPermissions: ['EMBED_LINKS'],
	subCommands: ['set', 'reset', { input: 'list', default: true }],
})
export class PrefixCommand extends MinervaCommand {

	public override async chatInputRun(interaction: MinervaCommand.Interaction) {
		const type = interaction.options.getSubcommand(true);
		const value = interaction.options.getString("value");

		if(type === "set") {
			await this.container.client.databases.guilds.set(interaction.guild?.id as string, 'prefix', value);
			await interaction.reply({ embeds: [createEmbed('success', `success changed to \`${value}\``, true)] })
		} else if(type === "reset") {
			await this.container.client.databases.guilds.set(interaction.guild?.id as string, 'prefix', this.client.config.env.PREFIX);
			await interaction.reply({
				embeds: [createEmbed('success', `Succesfully reset the prefix, current prefix is \`${this.client.config.env.PREFIX}\``, true)]
			});
		}
		return;
	}

	public async list(message: Message, args: Args) {
		await message.reply({
			embeds: [
				createEmbed('info', `Type \`${args.commandContext.prefix}prefix <option>\` to view more about an option. Available options :`)
					.addField('set', `${args.commandContext.commandPrefix}prefix set [args]`, true)
					.addField('reset', `${args.commandContext.commandPrefix}prefix reset`, true)
			]
		});
	}

	public async set(message: Message, args: Args) {
		const prefixValue = await args.pickResult('string');
		if (!prefixValue) {
			return message.reply({ content: `Please input the value of the prefix curent prefix is \`${args.commandContext.prefix}\`` });
		}

		await this.container.client.databases.guilds.set(message.guild?.id as string, 'prefix', prefixValue.value);
		await message.reply({
			embeds: [createEmbed('success', `${prefixValue.success ? 'succces' : 'fail'} changed to \`${prefixValue.value}\``, true)]
		});
		return;
	}

	public async reset(message: Message, args: Args) {
		await this.container.client.databases.guilds.set(message.guild?.id as string, 'prefix', this.client.config.env.PREFIX);
		await message.reply({
			embeds: [createEmbed('success', `Succesfully reset the prefix, current prefix is \`${this.client.config.env.PREFIX}`, true)]
		});
	}

	public override registerApplicationCommands(registry: MinervaCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) => 
				builder
					.setName(this.name)
					.setDescription(`Change prefix value!`)
					.addSubcommand((subcommand) => 
						subcommand
							.setName("set")
							.setDescription("Set prefix value")
							.addStringOption((option) => 
								option
									.setName("value")
									.setDescription("The prefix value")
									.setRequired(true)
							)
					)
					.addSubcommand((subcommand) => 
						subcommand
							.setName("reset")
							.setDescription("Reset the prefix value to default value")
					),
				{ idHints: [], guildIds: [this.client.config.env.DEV_SERVER_ID] }
		)
	}
}
