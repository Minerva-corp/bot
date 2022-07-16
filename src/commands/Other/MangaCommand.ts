import { MinervaCommand } from '#structures/MinervaCommand';
import { ApplyOptions } from '@sapphire/decorators';
import { ComponentType, type APIActionRowComponent, type APIMessageActionRowComponent } from 'discord-api-types/v10';
import { MessageActionRow, MessageActionRowComponent, MessageActionRowComponentResolvable, MessageButton, MessageSelectMenu } from 'discord.js';
import { createEmbed } from '#utils/createEmbed';
import { uid } from '#utils/random';
import Kitsu from 'kitsu';
import moment from 'moment';

@ApplyOptions<MinervaCommand['options']>({
	name: 'manga',
	description: 'Search a manga and returned Specific options.',
	chatInputCommand: {
		register: true,
		messageCommand: true,
		options: [
			{
				name: 'title',
				description: 'A title for search in kitsu API.',
				type: 'STRING',
				required: true
			}
		]
	}
})
export class MangaCommand extends MinervaCommand {
	public override async chatInputRun(interaction: MinervaCommand.Interaction) {
		await interaction.deferReply({ fetchReply: true });

		const api = new Kitsu();
		const manga = await interaction.options.getString('title');

		const { data } = await api.get('manga', { params: { filter: { text: manga } } });
		if (data.length === 0) {
			return interaction.reply({ content: 'Nothing was found for the requested manga!' });
		}

		const selectId = `select-${uid()}`;
		const select = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId(selectId)
				.setPlaceholder('Select a Manga!')
				.addOptions(
					data.map((res: { titles: { [s: string]: unknown } | ArrayLike<unknown>; description: string; slug: any }) => ({
						label: Object.values(res.titles)[0] || 'Unknown Name',
						description: res.description.slice(0, 100),
						value: res.slug
					}))
				)
		);
		return interaction
			.editReply({ content: `I found **${data.length}** possible matches, please select one of the following:`, components: [select] })
			.then((message: any) => {
				const filter = (i: { customId: string }) => i.customId === selectId;
				const collector = message.createMessageComponentCollector({ filter, componentType: ComponentType.SelectMenu, time: 60_000 });

				collector.on(
					'collect',
					async (i: {
						user: { id: string };
						deferUpdate: () => any;
						values: [any];
						editReply: (arg0: {
							content: string;
							embeds: any[];
							components: MessageActionRow<
								MessageActionRowComponent,
								MessageActionRowComponentResolvable,
								APIActionRowComponent<APIMessageActionRowComponent>
							>[];
						}) => any;
					}) => {
						if (i.user.id !== interaction.user.id) {
							return i.deferUpdate();
						}
						await i.deferUpdate();

						const [choices] = i.values;
						const result = data.find((x: { slug: any }) => x.slug === choices);
						const button = new MessageActionRow().addComponents(
							new MessageButton()
								.setStyle('LINK')
								.setLabel(`Browser Link kitsu.io/${result.slug}`)
								.setURL(`https://kitsu.io/manga/${result.slug}`)
						);

						const embed = createEmbed('info')
							.setTitle(result.titles.en_jp || Object.values(result.titles)[0])
							.setThumbnail(result.posterImage?.original)
							.addField(
								'__Details__',
								[
									`***English:*** ${result.titles.en ? result.titles.en : '`N/A`'}`,
									`***Japanese:*** ${result.titles.ja_jp ? result.titles.ja_jp : '`N/A`'}`,
									`***Synonyms:*** ${result.abbreviatedTitles.length > 0 ? result.abbreviatedTitles.join(', ') : '`N/A`'}`,
									`***Score:*** ${result.averageRating ? result.averageRating : '`N/A`'}`,
									`***Rating:*** ${result.ageRating ? result.ageRating : '`N/A`'}${
										result.ageRatingGuide ? ` - ${result.ageRatingGuide}` : ''
									}`,
									`***Type:*** ${
										result.mangaType
											? result.mangaType === 'oel'
												? result.mangaType.toUpperCase()
												: result.mangaType.toString()
											: '`N/A`'
									}`,
									`***Volumes:*** ${result.volumeCount ? result.volumeCount : '`N/A`'}`,
									`***Chapters:*** ${result.chapterCount ? result.chapterCount : '`N/A`'}`,
									`***Status:*** ${
										result.status ? (result.status === 'tba' ? result.status.toUpperCase() : result.status.toString()) : '`N/A`'
									}`,
									`***Published:*** ${
										result.startDate
											? `${moment(result.startDate).format('MMM D, YYYY')} to ${
													result.endDate ? moment(result.endDate).format('MMM D, YYYY') : '?'
											  }`
											: '`N/A`'
									}`,
									`***Serialization:*** ${result.serialization ? result.serialization : '`N/A`'}`
								].join('\n')
							)
							.setImage(result.coverImage?.small)
							.setFooter({ text: `Powered by kitsu.io`, iconURL: `https://i.imgur.com/YlUX5JD.png` })
							.setTimestamp();
						return i.editReply({ content: '\u200B', embeds: [embed], components: [button] });
					}
				);

				collector.on('end', (collected: any, reason: string) => {
					if (
						(collected.size === 0 || collected.filter((x: { user: { id: string } }) => x.user.id === interaction.user.id).size === 0) &&
						reason === 'time'
					) {
						return interaction.deleteReply();
					}
				});
			});
	}
}
