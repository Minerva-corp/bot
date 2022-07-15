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
		const embed = this.RunCommand(message.author);
		await message.reply({ embeds: [embed] });
	}

	public override async chatInputRun(interaction: MinervaCommand.Interaction): Promise<void> {
		const embed = this.RunCommand(interaction.user);
		await interaction.reply({ embeds: [embed] });
	}

	private RunCommand(user: User): MessageEmbed {
		const wsLatency = this.client.ws.ping.toFixed(0);
		const embed = createEmbed('info')
			.setColor(this.searchHex(wsLatency))
			.setTitle(`🏓 Pong!`)
			.setDescription(`🌐 **|** WebSocket: ${wsLatency}`)
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
