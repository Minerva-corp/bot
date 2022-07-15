import { MinervaCommand } from '#structures/MinervaCommand';
import { pickRandom } from '#utils/random';
import { toTitleCase } from '#utils/string';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<MinervaCommand['options']>({
	name: 'gmname',
	description: 'Returns random gamemode name',
	chatInputCommand: {
		register: true,
		messageCommand: true
	}
})
export class DynamicCommand extends MinervaCommand {
	public override async chatInputRun(interaction: MinervaCommand.Interaction) {
		await interaction.reply({ content: gamemodename().toString() });
	}
}

const coolwordsxd: string[] = [
	'advanced',
	'amazeballs',
	'amazing',
	'amk',
	'burger',
	'🍔',
	'edit',
	'elite',
	'exiting',
	'extr3m3',
	'extreme',
	'fucking',
	'fusion',
	'gold',
	'haram',
	'infusion',
	'l33t',
	'mega',
	'mom',
	'open',
	'pisd',
	'platinum',
	'pro',
	'profesional',
	'reloaded',
	'sa-mp server',
	'ultra',
	'wow',
	'xd',
	'xtreme',
	"you're",
	'kungkingkang',
	'mengheran',
	'mengakak',
	'menghadeh'
];

const morewords: string[] = [
	'abyss',
	'barp-leak',
	'black',
	'clan',
	'community',
	'español',
	'gaming',
	'gang',
	'ginger',
	'group',
	'hackers',
	'killaz',
	'krisk',
	'mom',
	'motherfuckers',
	'open.mp',
	'parkour',
	'pisd',
	'profesionals',
	'pros',
	'rcrp-leak',
	'revolution',
	'shoters',
	'scripters',
	'white',
	'you(them)tubers',
	'mengontol',
	'kontol',
	'pepeq'
];

const gamemodes: string[] = [
	'deathmatch',
	'derby',
	'dm',
	'freeroam',
	'game',
	'gangbang',
	'gangwars',
	'minigames',
	'pisd',
	'race',
	'racing',
	'roleplay',
	'dmrp',
	'rp',
	'rpg',
	'sex',
	'tdm',
	'war'
];

const tags: string[] = [
	'0.3.DL',
	'0.3e+',
	'25.000 LINES',
	'ABYSS',
	'BASIC',
	'BEST',
	'BETA',
	'BAPAKMU',
	'BOGOR',
	'C++',
	'CUSTOM OBJECTS',
	'DYNAMIC',
	'GF EDIT',
	'GO',
	'POWERED BY G00GLE',
	'GODFATHER',
	'HALAL',
	'HARAM',
	'HIRING',
	'IMPROVED',
	'IBUMU',
	'LAGSHOT',
	'LUA',
	'MOMS',
	'MYSQL',
	'NGG',
	'NGRP',
	'OFFICIAL',
	'OPEN.MP',
	'PAWN',
	'PAWNO',
	'PISD',
	'RAKNET',
	'RCRP',
	'REDIS',
	'REFUNDING',
	'ROLEYPLAY',
	'ROLLERPLAYERS ONLY',
	'RUS',
	'SAMPCTL',
	'SCRATCH',
	'SOUTHCLAWS',
	'SSCANF',
	'STRCMP',
	'STRCMP2',
	'STRTOK',
	'STRTOK2',
	'TELNET',
	'UCP',
	'UNIQUE',
	'YLESS',
	'Y_INI',
	'ZCMD',
	'ZOMBIES',
	'MISEBAHXD'
];

function gamemodename(): string {
	let buf = '';

	const coolword = pickRandom(coolwordsxd);
	switch (Math.floor(Math.random() * 3)) {
		case 0: {
			buf += `${coolword} `;
			break;
		}
		case 1: {
			buf += `${toTitleCase(coolword)} `;
			break;
		}
		case 2: {
			buf += `${coolword.toUpperCase()} `;
			break;
		}
	}

	const anotherword = pickRandom(morewords);
	switch (Math.floor(Math.random() * 3)) {
		case 0: {
			buf += `${anotherword} `;
			break;
		}
		case 1: {
			buf += `${toTitleCase(anotherword)} `;
			break;
		}
		case 2: {
			buf += `${anotherword.toUpperCase()} `;
			break;
		}
	}

	const gamemodename = pickRandom(gamemodes);
	console.log(gamemodename);
	switch (Math.floor(Math.random() * 4)) {
		case 0: {
			buf += gamemodename;
			break;
		}
		case 1: {
			buf += toTitleCase(gamemodename);
			break;
		}
		case 2: {
			buf += gamemodename.toUpperCase();
			break;
		}
		case 3: {
			buf += `[${gamemodename.toUpperCase()}]`;
			break;
		}
	}

	const UsableTag = [];
	for (let i = 0; i < Math.floor(Math.random() * 10); i++) {
		UsableTag.push(tags[i]);
	}

	console.log(UsableTag.length);

	for (const element of UsableTag) {
		buf += ` [${element}]`;
	}

	return buf;
}
