import { CommandContext } from '#root/lib/structures/CommandContext';
import { MinervaCommand } from '#structures/MinervaCommand';
import { ApplyOptions } from '@sapphire/decorators';
import { ColorResolvable, Message, MessageEmbed } from 'discord.js';

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
	public messageRun(message: Message): any {
        return this.run(new CommandContext(message));
    }

    public chatInputRun(interaction: MinervaCommand.Interaction<"cached">): any {
        return this.run(new CommandContext(interaction));
    }

    public run(ctx: CommandContext): any {
        ctx.reply({ content: "🏓 Pong!", fetchReply: true }).then(msg => {
            const wsLatency = this.container.client.ws.ping.toFixed(0);
            if (msg) {
                const latency = msg.createdTimestamp - ctx.context.createdTimestamp;
                msg.edit({
                    content: " ",
                    embeds: [
                        new MessageEmbed()
                            .setAuthor({ name: "🏓 PONG!", iconURL: this.container.client.user!.displayAvatarURL() })
                            .setColor(PingCommand.searchHex(wsLatency))
                            .addFields({
                                name: "📶 API Latency",
                                value: `**\`${latency}\`** ms`,
                                inline: true
                            }, {
                                name: "🌐 WebSocket Latency",
                                value: `**\`${wsLatency}\`** ms`,
                                inline: true
                            })
                            .setFooter({ text: `Requested by: ${ctx.author.tag}`, iconURL: ctx.author.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                    ]
                }).catch(e => this.container.logger.error(e));
            }
        }).catch(e => this.container.logger.error(e));
    }

    private static searchHex(ms: number | string): ColorResolvable {
        const listColorHex = [
            [0, 20, "#0DFF00"],
            [21, 50, "#0BC700"],
            [51, 100, "#E5ED02"],
            [101, 150, "#FF8C00"],
            [150, 200, "#FF6A00"]
        ];

        const defaultColor = "#FF0D00";

        const min = listColorHex.map(e => e[0]);
        const max = listColorHex.map(e => e[1]);
        const hex = listColorHex.map(e => e[2]);
        let ret: number | string = "#000000";

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
