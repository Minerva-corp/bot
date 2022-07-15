import { Events, Listener, Logger, LogLevel, MessageCommandSuccessPayload } from '@sapphire/framework';
import { bold, green } from 'colorette';

export class MessageCommandSuccess extends Listener<typeof Events.MessageCommandSuccess> {
	public run(payload: MessageCommandSuccessPayload) {
		const author = payload.message.author;
		const message = `${green(bold(`[${payload.context.prefix}${payload.command.name}]`))} - MessageCommand executed by ${author.tag} (${author.id})`;
		this.container.logger.debug(message);
	}

	public override onLoad() {
		this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
		return super.onLoad();
	}
}
