import { BOT_OWNER } from '#root/config';
import { AllFlowsPrecondition, AsyncPreconditionResult, Precondition } from '@sapphire/framework';

export class UserPrecondition extends Precondition {
	public override async messageRun(...[message]: Parameters<AllFlowsPrecondition['messageRun']>) {
		return this.isBotOwner(message.author.id);
	}

	public override async chatInputRun(...[interaction]: Parameters<AllFlowsPrecondition['chatInputRun']>) {
		return this.isBotOwner(interaction.user.id);
	}

	private async isBotOwner(id: string): AsyncPreconditionResult {
		return BOT_OWNER.includes(id) ? this.ok() : this.error({ message: 'Only owner to enable execute this command.' });
	}
}
