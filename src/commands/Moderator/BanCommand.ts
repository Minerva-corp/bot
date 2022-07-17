import { MinervaCommand } from '#root/lib/structures/MinervaCommand';
import { CatNo } from '#root/lib/types/declarations/emotes';
import { createEmbed } from '#root/lib/utils/createEmbed';
import { ApplyOptions } from '@sapphire/decorators';
import type { GuildMember, GuildMemberRoleManager, Message } from 'discord.js';

@ApplyOptions<MinervaCommand['options']>({
	name: 'ban',
	description: '👤Banned user from the Server',
	requiredClientPermissions: ['BAN_MEMBERS'],
	requiredUserPermissions: ['BAN_MEMBERS'],
	chatInputCommand: {
		register: true,
		messageCommand: true,
		options: [
			{
				name: 'user',
				description: 'the user to ban from the server',
				type: 'USER',
				required: true
			},
			{
				name: 'reason',
				description: 'Reason why ban the user from the server',
				type: 'STRING',
				required: false
			},
			{
				name: 'days',
				description: 'The day of the banned',
				type: 'NUMBER',
				required: false
			}
		]
	}
})
export class BanCommand extends MinervaCommand {
	public override async messageRun(message: Message, args: MinervaCommand.Args) {
		const userID = (await args.pickResult('member')).value?.id ?? (await args.pickResult('string')).value!;
		const user = (await message.guild?.members.resolve(userID)) as GuildMember;
		const reason = (await args.restResult('string')).value ?? 'No reason specified.';
		const days = Number(args.getOption('number')) ?? undefined;

		if (!user) {
			return message.reply({
				content: `${CatNo} - Please mention or put user id!`
			});
		}

		if (!user.kickable) {
			return message.reply({
				content: `${CatNo} - Sorry but I can't **BANNED** The user!`
			});
		}

		/** eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain */
		if (user.roles.highest.position >= message.member?.roles.highest.position!) {
			return message.reply({
				content: `${CatNo} - You can't **BANNED** this user because you'r roles is lower of the user to kick.`
			});
		}

		const awaitedMessage = await message.channel.send({
			embeds: [createEmbed('loading', `Trying to BANNED ${user.user.tag}`, true)]
		});

		const BannedUser = await message.guild?.members.resolve(user)?.ban({ days, reason });
		if (!BannedUser) {
			return awaitedMessage.edit({
				embeds: [createEmbed('error', `Unknown user, skipped to banned user`, true)]
			});
		}

		return awaitedMessage.edit({
			embeds: [createEmbed('success', `${user.user.tag} Have been Banned from the server successfully. Reason: ${reason}`, true)]
		});
	}

	public override async chatInputRun(interaction: MinervaCommand.Interaction) {
		const member = (await interaction.options.getMember('user')) as GuildMember;
		const reason = (await interaction.options.getString('reason')) || 'No reason specified.';
		const days = (await interaction.options.getNumber('days')) || undefined;
		const executorRole = interaction.member?.roles as GuildMemberRoleManager;

		if (!member.kickable) {
			return interaction.reply({
				content: `${CatNo} - Sorry but I cant **BANNED** The user`
			});
		}

		if (member.roles.highest.position >= executorRole.highest.position!) {
			return interaction.reply({
				content: `${CatNo} - You can't **BANNED** this user because you'r roles is lower of the user to kick.`
			});
		}

		await interaction.reply({
			embeds: [createEmbed('loading', `Trying to BANNED ${member.user.tag}`, true)]
		});

		const BannedUser = await interaction.guild?.members.resolve(member)?.ban({ days, reason });
		if (!BannedUser) {
			return interaction.editReply({
				embeds: [createEmbed('error', `Unknown user, skipped BANNED user`, true)]
			});
		}

		interaction.editReply({
			embeds: [createEmbed('success', `${member.user.tag} Have been BANNED from the server successfully. Reason: ${reason}`, true)]
		});
	}
}
