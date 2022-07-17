import { MinervaCommand } from '#root/lib/structures/MinervaCommand';
import { SadIcon } from '#root/lib/types/declarations/emotes';
import { createEmbed } from '#root/lib/utils/createEmbed';
import { ApplyOptions } from '@sapphire/decorators';
import { container } from '@sapphire/framework';
import { codeBlock } from '@sapphire/utilities';
// @ts-ignore
import samp from 'samp-query';
import { getBorderCharacters, table } from 'table';

@ApplyOptions<MinervaCommand['options']>({
	name: 'samp-query',
	description: 'Query to samp server',
	chatInputCommand: {
		register: true,
		messageCommand: true,
		options: [
			{
				name: 'address',
				description: 'The ip address of samp servers',
				type: 'STRING',
				required: true
			},
			{
				name: 'port',
				description: 'The port of samp servers, optional default is 7777',
				type: 'NUMBER',
				required: false
			}
		]
	}
})
export class SampCommand extends MinervaCommand {
	public override async chatInputRun(interaction: MinervaCommand.Interaction) {
		const ip = interaction.options.getString('address');
		const port = interaction.options.getNumber('port') || 7777;
		const options = {
			host: ip?.toString(),
			port
		};

		const config = {
			border: getBorderCharacters(`void`),
			columnDefault: {
				paddingLeft: 0,
				paddingRight: 1
			},
			drawHorizontalLine: () => {
				return false;
			}
		};

		samp(options, async function (_err: any, response: any) {
			if (_err) {
				return;
			}
			const players: any[][] = [];
			let output;
			response.players.forEach((player: { id: any; name: any; score: any; ping: any }) => {
				players.push([player.id, player.name, player.score, player.ping]);
			});

			output = players.length === 0 ? 'None' : table(players, config);

			await interaction.reply({
				embeds: [
					createEmbed('info', `**__${response.hostname}__**`)
						.addFields(
							{
								name: 'IP',
								value: `${ip}:${port}`,
								inline: true
							},
							{
								name: 'Gamemode',
								value: `${response.gamemode}`,
								inline: true
							},
							{
								name: 'Mapname',
								value: `${response.mapname}`,
								inline: true
							},
							{
								name: 'WebUrl',
								value: `[${response.rules.weburl}](${await container.client.utils.cleanUrl(response.rules.weburl)})`
							},
							{
								name: `Passworded`,
								value: `${response.passworded ? 'Yes' : 'No'}`,
								inline: true
							},
							{
								name: `Player`,
								value: `${response.online}/${response.maxplayers}`,
								inline: true
							}
						)
						.addField('Rules', `\`${Object.values(response.rules).join(', ')}\``)
						.addField(`**__ID Name Score Ping__** Only show 10 Players`, codeBlock('js', output))
				]
			});
		});
	}
}
