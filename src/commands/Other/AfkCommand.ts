import { CommandContext } from '#root/lib/structures/CommandContext';
import { CatNo, PepeYes } from '#root/lib/types/declarations/emotes';
import { MinervaCommand } from '#structures/MinervaCommand';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';

@ApplyOptions<MinervaCommand['options']>({
	name: 'afk',
	description: 'Sets you status to AFK.'
})
export class AfkCommand extends MinervaCommand {
	public override async messageRun(message: Message, args: MinervaCommand.Args) {
		return this.run(new CommandContext(message, args));
	}

	private async run(ctx: CommandContext): Promise<any> {
		const data = await this.client.databases.afk.get(ctx.context.guildId as string, ctx.author.id as string);
		const reason = await ctx.args?.pickResult('string')

		if (data && data.isAfk) {
			return ctx.reply({ content: `${CatNo} - You're already __AFK__!` });
		}

		if (ctx.context.member?.manageable) {
			ctx.context.member.setNickname(`[AFK] ${ctx.author.username}`);
		}

		await this.client.databases.afk.set(ctx.context.guildId as string, ctx.author.id as string, 'isAfk', true);
		await this.client.databases.afk.set(ctx.context.guildId as string, ctx.author.id as string, 'AfkReason', reason?.value || 'No Reason');
		await this.client.databases.afk.set(ctx.context.guildId as string, ctx.author.id as string, 'AfkDate', Date.now());
		return ctx.reply({ content: `${PepeYes} - You're has been setted AFK Succesfully. Reason: ${reason?.value || "No Reason"}` })
	}
}
