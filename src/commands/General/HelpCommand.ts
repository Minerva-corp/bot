import { capitalize } from '#utils/string';
import { MinervaCommand } from '#structures/MinervaCommand';
import { ApplyOptions } from '@sapphire/decorators';
import { AutocompleteInteraction, EmbedFieldData, Message, MessageActionRow, MessageButton, MessageEmbed, User } from 'discord.js';
import Fuse from 'fuse.js';
import { SUPPORT_SERVER } from '#root/config';
import { Check_Mark, SadIcon, SlashCommandsIcon } from '#root/lib/types/declarations/emotes';

@ApplyOptions<MinervaCommand['options']>({
	name: 'help',
	aliases: ['commands'],
	description: 'A list of all the commands',
	requiredClientPermissions: ['EMBED_LINKS'],
	chatInputCommand: {
		messageCommand: true,
		register: true,
		options: [
			{
				name: 'command',
				type: 'STRING',
				description: 'Name of the command for the display specific information',
				required: false,
				autocomplete: true
			}
		]
	}
})
export class HelpCommand extends MinervaCommand {
	public override async messageRun(message: Message, args: MinervaCommand.Args, context: MinervaCommand.MessageContext): Promise<void> {
		const cmd = await args.pickResult('string');
		const command = this.container.stores.get('commands').get(cmd.value ?? '') as MinervaCommand | undefined;
		const embed = this.RunCommand(context, message.author, command);

		if (cmd.value) {
			await message.reply({ embeds: [this.SearchCommand(context, message.author, command)] });
		} else {
			await message.author.send({
				embeds: [embed],
				components: [this.GetButton()]
			});
			await message.react('📬');
		}
	}

	public override async chatInputRun(interaction: MinervaCommand.Interaction, context: MinervaCommand.SlashCommandContext) {
		const cmd = interaction.options.getString('command', false);
		const command = this.container.stores.get('commands').get(cmd ?? '') as MinervaCommand | undefined;
		const embed = this.RunCommand(context, interaction.user, command);

		if (cmd) {
			await interaction.reply({ embeds: [this.SearchCommand(context, interaction.user, command)] });
		} else {
			await interaction.user.send({
				embeds: [embed],
				components: [this.GetButton()]
			});
			await interaction.reply(`${Check_Mark} Your help message successfully send to the **__Direct Message__** !`);
		}
	}

	public override async autocompleteRun(interaction: AutocompleteInteraction): Promise<void> {
		let commands = [...this.container.stores.get('commands').values()] as MinervaCommand[];
		if (!this.client.isOwner(interaction.user.id)) {
			commands = commands.filter((c) => !c.OwnerOnly);
		}
		const Run = new Fuse(commands, {
			keys: ['name', 'description']
		});

		const input = interaction.options.getString('command', false) ?? '';
		if (!input) {
			return interaction.respond(commands.map((cmd) => ({ name: capitalize(cmd.name), value: cmd.name })));
		}

		const results = Run.search(input);
		await interaction.respond(results.map((res) => ({ name: capitalize(res.item.name), value: res.item.name })));
	}

	private GetButton() {
		const buttons = new MessageActionRow().addComponents(new MessageButton().setLabel('Support Server').setStyle('LINK').setURL(SUPPORT_SERVER));

		return buttons;
	}

	private RunCommand(
		context: MinervaCommand.MessageContext | MinervaCommand.SlashCommandContext,
		user: User,
		command?: MinervaCommand
	): MessageEmbed {
		const embed = new MessageEmbed()
			.setAuthor({ name: `Full Command - ${user.tag}`, iconURL: command?.client.user?.displayAvatarURL({ dynamic: true }) })
			.setDescription(`Use ${SlashCommandsIcon} Slash commands or Text command chose your options!`)
			.setColor('BLUE')
			.setThumbnail(this.client.user?.displayAvatarURL({ dynamic: true }) as string)
			.setFooter({ text: `Request by ${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
			.setTimestamp();

		const isOwner = this.client.isOwner(user.id);
		const commands = [...this.container.stores.get('commands').values()] as MinervaCommand[];
		let categories = [...new Set(commands.map((c) => c.category ?? 'default'))];

		if (!isOwner) {
			categories = categories.filter((c) => c.toLowerCase() !== 'developers');
		}

		const fields: EmbedFieldData[] = categories.map((category) => {
			const valid = commands.filter((c) => c.category === category);
			const filtered = isOwner ? valid : valid.filter((c) => !c.hidden || !c.OwnerOnly);

			return {
				name: `**__${category}__**`,
				value: filtered.map((c) => `\`${c.name ?? c.aliases[0] ?? 'Unknown'}\``).join(', ')
			};
		});

		embed.setFields(fields);
		return embed;
	}

	private SearchCommand(
		context: MinervaCommand.MessageContext | MinervaCommand.SlashCommandContext,
		user: User,
		command?: MinervaCommand
	): MessageEmbed {
		const embed = new MessageEmbed()
			.setAuthor({ name: `Information Command for - ${context.commandName}` })
			.setColor('YELLOW')
			.setThumbnail(this.client.user?.displayAvatarURL({ dynamic: true }) as string)
			.setFooter({ text: `<> = required | [] = optional` });

		if (command) {
			embed.addField('Name', `**\`${command.name}**\``, false);
			embed.addField('Description', `${command.description}`, true);
			embed.addField('Category', `**\`${command.category}**\``, false);
			embed.addField('Aliases', `${command.aliases.length ? command.aliases.map((a) => `**\`${a}\`**`).join(', ') : 'None'}`, false);
		} else {
			embed.setAuthor(null);
			embed.setThumbnail('');
			embed.setFooter(null);
			embed.setDescription(`${SadIcon} - Upss, I can't find thats commands!`);
		}

		return embed;
	}
}
