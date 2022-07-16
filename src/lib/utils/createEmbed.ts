import { ColorResolvable, MessageEmbed } from 'discord.js';
import { Check_Mark, Error_Mark, Info_Mark, Loading_Mark } from '#root/lib/types/declarations/emotes';

type hexColorsType = 'error' | 'info' | 'success' | 'warn' | 'loading';
const hexColors: Record<hexColorsType, ColorResolvable> = {
	error: 'RED',
	info: 'BLUE',
	success: 'GREEN',
	warn: 'YELLOW',
	loading: "WHITE"
};

export function createEmbed(type: hexColorsType, message?: string, emoji = false): MessageEmbed {
	const embed = new MessageEmbed().setColor(hexColors[type] as ColorResolvable);

	if (message) {
		embed.setDescription(message);
	}
	if(type === 'info' && emoji) {
		embed.setDescription(`${Info_Mark} **|** ${message}`)
	}
	if(type === 'loading' && emoji) {
		embed.setDescription(`${Loading_Mark} **|** ${message}`)
	}
	if (type === 'error' && emoji) {
		embed.setDescription(`${Error_Mark} **|** ${message!}`);
	}
	if (type === 'success' && emoji) {
		embed.setDescription(`${Check_Mark} **|** ${message!}`);
	}
	return embed;
}
