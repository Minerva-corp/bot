import { CommandContext } from '#root/lib/structures/CommandContext';
import { CatNo, PepeYes } from '#root/lib/types/declarations/emotes';
import { MinervaCommand } from '#structures/MinervaCommand';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
@ApplyOptions<MinervaCommand['options']>({
	name: 'afk',
	description: 'Sets you status to AFK.',
	chatInputCommand: {
		register: true,
		messageCommand: true,
		options: [
			{
				name: 'reason',
				description: 'The afk reason',
				type: 'STRING',
				required: false
			}
		]
	}
})
export class AfkCommand extends MinervaCommand {
	public override async messageRun(message: Message, args: MinervaCommand.Args) {
		return this.run(new CommandContext(message, args));
	}

	public override async chatInputRun(interaction: MinervaCommand.Interaction<'cached'>) {
		return this.run(new CommandContext(interaction));
	}

	private async run(ctx: CommandContext): Promise<any> {
		const data = await this.client.databases.afk.get(ctx.context.guildId as string, ctx.author.id as string);
		const reason = (await ctx.args?.pickResult('string')!).value || ctx.options?.getString('reason')

		if (data && data.isAfk) {
			return ctx.reply({ content: `${CatNo} - You're already __AFK__!` });
		}

		if (ctx.context.member?.manageable) {
			ctx.context.member.setNickname(`[AFK] ${ctx.author.username}`);
		}

		await this.client.databases.afk.set(ctx.context.guildId as string, ctx.author.id as string, 'isAfk', true);
		await this.client.databases.afk.set(ctx.context.guildId as string, ctx.author.id as string, 'AfkReason', reason || 'No Reason');
		await this.client.databases.afk.set(ctx.context.guildId as string, ctx.author.id as string, 'AfkDate', Date.now());
		return ctx.reply({ content: `${PepeYes} - You're has been setted AFK Succesfully. Reason: ${reason || "No Reason"}` })
	}
}
