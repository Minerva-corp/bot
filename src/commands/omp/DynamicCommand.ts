import { MinervaCommand } from '#structures/MinervaCommand';
import { pickRandom } from '#utils/random';
import { toTitleCase } from '#utils/string';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<MinervaCommand['options']>({
	name: 'dynamic',
	description: 'Returns random dynamic feature',
	chatInputCommand: {
		register: true,
		messageCommand: true
	}
})
export class DynamicCommand extends MinervaCommand {
	public override async chatInputRun(interaction: MinervaCommand.Interaction) {
		await interaction.reply({ content: dynamicname().toString() });
	}
}

const scripts: string[] = [
	'3D Tryg',
	'AFK',
	'ATM Machine System',
	"ATM Machine's",
	'ATM System',
	"ATM's",
	'Admin-Vehicle Lock - for all u lazy ppl!!!',
	'Animations',
	'Backpack',
	'Bash',
	'Bazookas System',
	'Biz',
	'Bomb System',
	'Boobs',
	'Business',
	'Business v1.0',
	'Business v1.0-R1',
	'Business v1.0-R2',
	'Business v1.0-R3',
	'Business v1.0-R3.1',
	'Buy Weapon And Kits',
	'Car Ownership System',
	'Categories',
	'Checkpoints',
	'Circles',
	'Company',
	'Dialog Gang Bang System',
	'Dialog Gang System',
	'Dialog Maker',
	'Dildo System',
	'Door System',
	'EPIC HOUSE',
	'EnEx',
	'Entrance',
	'Fire-Bin',
	'GPS',
	'Gang Bang',
	'Gang',
	'Garage',
	'Garbage Collector',
	'Gate',
	'Gates',
	'Guild System',
	'Guild',
	'Hot Coffee',
	'House System',
	'House Creating!',
	'House',
	'House-Biz System',
	'House-Business System',
	'Ice Cream Creation',
	'IconMaker',
	'Interior',
	'Interiors',
	'Job Creation',
	'Large Arrays',
	'Material Text',
	'Media Dialog',
	'Menus',
	'Milf',
	'Milf Gang Bang',
	'Mom',
	'Mom Gang Bang',
	'Myth Creator',
	'News',
	'Org Creation',
	'PISD',
	'Player Account Data',
	'Player Enumerator',
	'Position save system',
	'PowerShell',
	'Race system',
	'Rules ← Using HTTP!',
	'Semi Dynamic System',
	'Server Signature Generator',
	'Short Arrays',
	'Stingers',
	'Stores',
	'Street w/ sign',
	'System',
	'Teleport',
	'Telnet Client',
	'Telnet Server',
	'Update',
	'VEHICLES',
	'Vehicle & Dealership',
	'Vehicle Creator',
	'Vehicle Spawn Menu',
	'Vehicle System',
	'Vertify',
	'Vibrator System',
	'Weapon control',
	'Weapon shop'
];

const features: string[] = [
	' ← USING HTTP!',
	'0.3d Compatible',
	'1 line',
	'3D Label',
	'Can also be used for missions!',
	'DJSON',
	'Draft',
	'Dynamic!',
	'Map icon',
	'MSSQL',
	'MySQL',
	'Object',
	'Pickup',
	'SQL',
	'SQLite',
	'Saves + Loads Through MySQL!',
	'Scripting SpeedArt Video',
	'TextDraw',
	'User Friendly',
	'account vertification',
	'for Roleplay',
	'loading & saving',
	'pisd',
	'semi dynamicness',
	'streamer',
	'with advanced anti db',
	'zcmd'
];

function dynamicname(): string {
	let buf = '';
	const style = Math.floor(Math.random() * 10);

	switch (style) {
		case 0: {
			buf += 'dynamic ';
			break;
		}
		case 1: {
			buf += 'Dynamic ';
			break;
		}
		case 2: {
			buf += 'DYNAMIC ';
			break;
		}
		case 3: {
			buf += '[DYNAMIC] ';
			break;
		}
	}

	let script = pickRandom(scripts);
	switch (Math.floor(Math.random() * 3)) {
		case 0: {
			buf += `${script.toString()} `;
			break;
		}
		case 1: {
			buf += `${toTitleCase(script)} `;
			break;
		}
		case 2: {
			buf += `${script.toUpperCase()} `;
			break;
		}
	}

	if (Math.floor(Math.random() * 100) < 50) {
		buf += 'and ';
		script = pickRandom(scripts);
		switch (Math.floor(Math.random() * 3)) {
			case 0: {
				buf += `${script.toString()} `;
				break;
			}
			case 1: {
				buf += `${toTitleCase(script)} `;
				break;
			}
			case 2: {
				buf += `${script.toUpperCase()} `;
				break;
			}
		}
	}

	if (Math.floor(Math.random() * 100) < 50) {
		buf += ' ! ';
	}

	switch (style) {
		case 0: {
			buf += 'system';
			break;
		}
		case 1: {
			buf += 'System';
			break;
		}
		case 2: {
			buf += 'SYSTEM';
			break;
		}
		case 3: {
			buf += '[SYSTEM]';
			break;
		}
	}

	const UsableTag = [];
	for (let i = 0; i < Math.floor(Math.random() * 3); i++) {
		UsableTag.push(pickRandom(features));
	}

	for (const element of UsableTag) {
		buf += Math.floor(Math.random() * 2) === 0 ? ` [${element}]` : ` ${element}`;
	}

	if (Math.floor(Math.random() * 10_000) === 1) {
		buf += ' with extra turtle';
	}

	return buf;
}
