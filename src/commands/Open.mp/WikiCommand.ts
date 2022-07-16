import { MinervaCommand } from '#structures/MinervaCommand';
import { createEmbed } from '#utils/createEmbed';
import { hyperlink } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import type { AutocompleteInteraction } from 'discord.js';
import fetch from 'node-fetch';

@ApplyOptions<MinervaCommand['options']>({
	name: 'wiki',
	description: 'Returns a article from open.mp wiki',
	requiredClientPermissions: ['EMBED_LINKS'],
	chatInputCommand: {
		register: true,
		messageCommand: true,
		options: [
			{
				name: 'search-term',
				type: 'STRING',
				description: 'Documention name to search in open.mp wiki',
				required: true,
				autocomplete: true
			}
		]
	}
})
export class WikiCommand extends MinervaCommand {
	public override async chatInputRun(interaction: MinervaCommand.Interaction): Promise<void> {
		const docsName = await interaction.options.getString('search-term');
		const response: any = await fetch(`https://api.open.mp/docs/search?q=${docsName}`).then((res) => res.json());
		const hits: string[] = [];

		/* eslint-disable-next-line unicorn/no-array-for-each */
		response.hits.forEach((hit: any) => {
			hits.push(`${hyperlink(hit.title, `https://open.mp/${hit.url}`)}: ${hit.desc}`);
		});
		interaction.reply({ embeds: [createEmbed('info', `Results of **__${docsName}__**\n\n${hits.slice(0, 4).join('\n').toString()}`, true)] });
	}

	public override async autocompleteRun(interaction: AutocompleteInteraction): Promise<void> {
		const userInput = interaction.options.getFocused().toString();
		const getFullInput = interaction.options.getFocused(true);

		const textInput = getFullInput.name === 'search-term' ? getFullInput.value : interaction.options.getString('search-term');

		const hit: any = await fetch(`https://api.open.mp/docs/search?q=${textInput}`).then((res) => res.json());

		if (!textInput) {
			return interaction.respond([
				{
					name: 'Type documention name for search in open.mp wiki!',
					value: userInput
				}
			]);
		}
		const filterWiki = hit.hits.filter((x: any) => x.title?.toLowerCase().includes(textInput.toLowerCase()));

		await interaction
			.respond(
				filterWiki
					.map((choice: any) => ({
						name: choice.title,
						value: choice.title
					}))
					.slice(0, 10)
			)
			.catch((error) => {
				console.log(error.message);
			});
	}
}
