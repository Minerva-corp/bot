import { MinervaCommand } from '#structures/MinervaCommand';
import { createEmbed } from '#utils/createEmbed';
import { ApplyOptions } from '@sapphire/decorators';
import type { ColorResolvable, Message, MessageEmbed, User } from 'discord.js';

@ApplyOptions<MinervaCommand['options']>({
	name: 'ping',
	aliases: ['pong', 'pi'],
	description: 'Ping! Pong! 🏓',
	chatInputCommand: {
		register: true,
		messageCommand: true
	}
})
export class PingCommand extends MinervaCommand {
	public override async messageRun(message: Message): Promise<void> {
		const before = Date.now();
		const pingMessage = await message.reply(`Ping?`);
		const after = Date.now() - before;
		const embed = this.RunCommand(after.toString(), message.author);
		await pingMessage.edit({ embeds: [embed], content: ' ' });
	}

	public override async chatInputRun(interaction: MinervaCommand.Interaction): Promise<void> {
		const before = Date.now();
		await interaction.reply({ content: `Ping?` });
		const after = Date.now() - before;
		const embed = this.RunCommand(after.toString(), interaction.user);
		await interaction.editReply({ embeds: [embed], content: ' ' });
	}

	private RunCommand(latency: string, user: User): MessageEmbed {
		const wsLatency = this.client.ws.ping.toFixed(0);
		const embed = createEmbed('info')
			.setColor(this.searchHex(wsLatency))
			.setTitle(`🏓 Pong!`)
			.addFields(
				{
					name: '📶 **|** API',
					value: `**\`${latency}\`** ms`,
					inline: true
				},
				{
					name: `🌐 **|** WebSocket`,
					value: `**\`${wsLatency}\`** ms`,
					inline: true
				}
			)
			.setFooter({ text: `Request by ${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
			.setTimestamp();

		return embed;
	}

	private searchHex(ms: number | string): ColorResolvable {
		const listColorHex = [
			[0, 20, 'GREEN'],
			[21, 50, 'GREEN'],
			[51, 100, 'YELLOW'],
			[101, 150, 'YELLOW'],
			[150, 200, 'RED']
		];

		const defaultColor = 'RED';

		const min = listColorHex.map((e) => e[0]);
		const max = listColorHex.map((e) => e[1]);
		const hex = listColorHex.map((e) => e[2]);
		let ret: number | string = '#000000';

		for (let i = 0; i < listColorHex.length; i++) {
			if (min[i] <= ms && ms <= max[i]) {
				ret = hex[i];
				break;
			} else {
				ret = defaultColor;
			}
		}
		return ret as ColorResolvable;
	}
}
