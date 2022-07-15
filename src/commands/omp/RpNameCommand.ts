import { pickRandom } from '#utils/random';
import { MinervaCommand } from '#structures/MinervaCommand';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<MinervaCommand['options']>({
	name: 'rpname',
	description: 'the next big unique dynamic server.',
	chatInputCommand: {
		register: true,
		messageCommand: true
	}
})
export class RpNameCommand extends MinervaCommand {
	public override async chatInputRun(interaction: MinervaCommand.Interaction): Promise<void> {
		await interaction.reply({ content: rpname().toString() });
	}
}

const rpfirsts: string[] = [
	'CJ',
	'O.G.',
	'SAMP',
	'bay',
	'bone',
	'bulgarian',
	'capital',
	'carl',
	'evolve',
	'gay',
	'german',
	'god',
	'godfather',
	'grand',
	'halal',
	'infinity',
	'las',
	'leaked',
	'los',
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
	'texas',
	'kungkingkang',
	'mengontol',
	'misebah'
];

const rpseconds: string[] = [
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
	'larceny',
	'life',
	'one',
	'parrot',
	'pisd',
	'play',
	'survive',
	'turtle',
	'world',
	'timer'
];

function rpname(): string {
	const first = pickRandom(rpfirsts);
	const seconds = pickRandom(rpseconds);
	return `${first.charAt(0).toUpperCase()}${seconds.charAt(0).toUpperCase()}RP: ${first.toUpperCase()} ${seconds.toUpperCase()} Roleplay`;
}
