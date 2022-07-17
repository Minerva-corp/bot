import { CommandContext } from '#root/lib/structures/CommandContext';
import { MinervaCommand } from '#root/lib/structures/MinervaCommand';
import { SadIcon } from '#root/lib/types/declarations/emotes';
import { ApplyOptions } from '@sapphire/decorators';
import { GuildMember, Message, MessageEmbed } from 'discord.js';

@ApplyOptions<MinervaCommand['options']>({
	name: 'avatar',
	description: "Display you'r avatar or another member avatar.",
	chatInputCommand: {
		register: true,
		messageCommand: true,
		options: [
			{
				name: 'users',
				description: 'the users for the display avatar',
				type: 'USER',
				required: false
			}
		],
		contextmenu: 'USER'
	}
})
export class AvatarCommand extends MinervaCommand {
	public override async messageRun(message: Message, args: MinervaCommand.Args) {
		const userID = await args.pickResult('string');
		const member =
			(message.mentions.users.first() as unknown as GuildMember) ||
			(message.guild?.members.cache.get(userID.value as string) as GuildMember) ||
			message.member;

		return this.run(new CommandContext(message), member);
	}

	public override async chatInputRun(interaction: MinervaCommand.Interaction) {
		const member = (interaction.options.getMember('users') as GuildMember) || interaction.member as GuildMember;

		return this.run(new CommandContext(interaction), member);
	}

	private run(ctx: CommandContext, user: GuildMember): any {
		if(!user) {
			return ctx.reply({ content: `${SadIcon} - The user was not found!` })
		}

		return ctx.reply({ 
			embeds: [
				new MessageEmbed()
					.setColor('GREY')
					.setAuthor({ name: user.user.tag, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
					.setImage(user.user.displayAvatarURL({ dynamic: true, size: 4096 }))
			]
		})
	}
}
