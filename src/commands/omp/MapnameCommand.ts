import { MinervaCommand } from '#structures/MinervaCommand';
import { pickRandom } from '#utils/random';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<MinervaCommand['options']>({
	name: 'mpname',
	description: 'Returns random map name',
	chatInputCommand: {
		register: true,
		messageCommand: true
	}
})
export class MapnameCommand extends MinervaCommand {
	public override async chatInputRun(interaction: MinervaCommand.Interaction): Promise<void> {
		await interaction.reply({ content: mpname().toString() });
	}
}

const firsts: string[] = [
	'CJ',
	'O.G.',
	'SAMP',
	'adorable',
	'bay',
	'bone',
	'bulgarian',
	'capital',
	'carl',
	'evolve',
	'gay',
	'god',
	'godfather',
	'halal',
	'infinity',
	'las',
	'leaked',
	'mom',
	'next',
	'one',
	'payday',
	'pisd',
	'pure',
	'red',
	'role',
	'san',
	'scavenge',
	'sexy',
	'texas'
];

const seconds: string[] = [
	'SAMP',
	'andreas',
	'area',
	'christian',
	'cops',
	'county',
	'day',
	'game',
	'gangstas',
	'ginger',
	'halal',
	'johnson',
	'life',
	'one',
	'parrot',
	'pisd',
	'play',
	'survive',
	'turtle',
	'world'
];

function mpname(): string {
	const first = pickRandom(firsts);
	const second = pickRandom(seconds);
	return `${first.charAt(0).toUpperCase()}${second.charAt(0).toUpperCase()}-MP: ${first.toUpperCase()} ${second.toUpperCase()} Multiplayer`;
}
