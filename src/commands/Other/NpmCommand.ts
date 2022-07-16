import { ApplyOptions } from '@sapphire/decorators';
import { MinervaCommand } from '#structures/MinervaCommand';
import type { AutocompleteInteraction } from 'discord.js';
import fetch from 'node-fetch';
import { createEmbed } from '#utils/createEmbed';

@ApplyOptions<MinervaCommand['options']>({
	name: 'npm',
	description: 'Returns specific information of the searched package',
	chatInputCommand: {
		register: true,
		messageCommand: true,
		options: [
			{
				name: 'package',
				type: 'STRING',
				description: 'The package name to search in NPM Api',
				autocomplete: true,
				required: true
			}
		]
	}
})
export class NpmCommand extends MinervaCommand {
	public override async chatInputRun(interaction: MinervaCommand.Interaction): Promise<void> {
		const packageName = interaction.options.getString('package');
		const response: any = await fetch(`https://api.npms.io/v2/search?q=${packageName}`).then((res) => res.json());

		const pkg = response.results[0].package;
		await interaction.reply({
			embeds: [
				createEmbed('info', pkg.description)
					.setAuthor({ name: `NPM`, iconURL: `https://i.imgur.com/ErKf5Y0.png`, url: `https://npmjs.com/` })
					.setTitle(`${pkg.name}`)
					.setURL(pkg.links.npm)
					.addField(`Author`, pkg.author ? pkg.author.name : 'None')
					.addField(`Version`, pkg.version)
					.addField(`Description`, truncate(pkg.description, 1024) || 'None')
					.addField(`Repository`, pkg.links.repository ? pkg.links.repository : 'None')
					.addField(`Maintainers`, truncate(pkg.maintainers ? pkg.maintainers.map((e: any) => e.username).join(', ') : 'None', 1024))
					.setFooter({ text: `Request by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
					.setTimestamp()
			]
		});
	}

	public override async autocompleteRun(interaction: AutocompleteInteraction): Promise<void> {
		const userInput = interaction.options.getFocused().toString();
		const getFullInput = interaction.options.getFocused(true);

		const textInput = getFullInput.name === 'package' ? getFullInput.value : interaction.options.getString('package');
		const response: any = await fetch(`https://api.npms.io/v2/search?q=${textInput}`).then((response) => response.json());
		if (!textInput) {
			return interaction.respond([
				{
					name: 'Type the name of an npm package for more options to show!',
					value: userInput
				}
			]);
		}
		const filteredPackage = response.results.filter((x: { package: { name: string } }) =>
			x.package.name?.toLowerCase().includes(textInput.toLowerCase())
		);

		await interaction
			.respond(
				filteredPackage
					.map((choice: any) => ({
						name: choice.package.name,
						value: choice.package.name
					}))
					.slice(0, 25)
			)
			.catch((error) => {
				console.log(error.message);
			});
	}
}

function truncate(input: string, total: number) {
	if (input.length > total) {
		return `${input.slice(0, Math.max(0, total))}...`;
	}
	return input;
}
