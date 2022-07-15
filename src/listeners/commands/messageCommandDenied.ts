import { Events, Listener, MessageCommandDeniedPayload, UserError } from '@sapphire/framework';

export class MessageCommandDenied extends Listener<typeof Events.MessageCommandDenied> {
	public async run({ context, message: content }: UserError, payload: MessageCommandDeniedPayload) {
		/* eslint no-new-object: 0 */
		if (Reflect.get(new Object(context), 'silent')) {
			return;
		}

		return payload.message.reply({
			content,
			allowedMentions: { repliedUser: true }
		});
	}
}
