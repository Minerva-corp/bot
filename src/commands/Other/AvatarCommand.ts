import { MinervaCommand } from "#root/lib/structures/MinervaCommand";
import { SadIcon } from "#root/lib/types/declarations/emotes";
import { ApplyOptions } from "@sapphire/decorators";
import { GuildMember, Message, MessageEmbed } from "discord.js";

@ApplyOptions<MinervaCommand['options']>({
    name: 'avatar',
    description: "Display you'r avatar or another member avatar.",
})

export class AvatarCommand extends MinervaCommand {
    public override async messageRun(message: Message, args: MinervaCommand.Args) {
        const userID = await args.pickResult('string') 
        const member = message.mentions.users.first() as unknown as GuildMember || message.guild?.members.cache.get(userID.value as string) as GuildMember || message.member;

        if(!member) {
            return message.reply({ content: `${SadIcon} - That user was not found!` })
        }

        await message.reply({ embeds: [new MessageEmbed().setColor("GREY").setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) }).setImage(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))] })
    }
}