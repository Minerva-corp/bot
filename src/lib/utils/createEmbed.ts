import { ColorResolvable, MessageEmbed } from 'discord.js';
import { Check_Mark } from '#types/emotes';

type hexColorsType = 'error' | 'info' | 'success' | 'warn';
const hexColors: Record<hexColorsType, ColorResolvable> = {
	error: 'RED',
	info: 'RANDOM',
	success: 'GREEN',
	warn: 'YELLOW'
};

export function createEmbed(type: hexColorsType, message?: string, emoji = false): MessageEmbed {
	const embed = new MessageEmbed().setColor(hexColors[type] as ColorResolvable);

	if (message) {
		embed.setDescription(message);
	}
	if(type === 'info' && emoji) {
		embed.setDescription(`:x: **|** ${message}`)
	}
	if (type === 'error' && emoji) {
		embed.setDescription(`:x: **|** ${message!}`);
	}
	if (type === 'success' && emoji) {
		embed.setDescription(`${Check_Mark} **|** ${message!}`);
	}
	return embed;
}
