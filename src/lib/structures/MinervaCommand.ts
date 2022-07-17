import {
	Args as CommandArgs,
	PieceContext as CTX,
	UserError,
	MessageCommandContext,
	ChatInputCommandContext,
	AutocompleteCommandContext,
	ContextMenuCommandContext,
	ApplicationCommandRegistry,
	RegisterBehavior,
	ApplicationCommandRegistryRegisterOptions,
	ChatInputCommand
} from '@sapphire/framework';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import type { ApplicationCommandOptionData, CacheType, CommandInteraction, PermissionResolvable } from 'discord.js';
import type { MinervaClient } from '#structures/MinervaClient';

export abstract class MinervaCommand extends SubCommandPluginCommand<CommandArgs, MinervaCommand> {
	public declare readonly options: MinervaCommand.Options;
	public readonly hidden: boolean;
	public readonly OwnerOnly: boolean;

	public readonly permissions: PermissionResolvable;
	public readonly clientPermissions: PermissionResolvable;

	public override client: MinervaClient;
	static CommandContext: any;

	public constructor(context: CTX, options: MinervaCommand.Options) {
		super(context, {
			chatInputCommand: options.chatInputCommand ? { ...options.chatInputCommand, register: true } : undefined,
			...options
		});

		if (!options.name) {
			// eslint-disable-next-line @typescript-eslint/no-base-to-string
			this.container.logger.warn(`No name provided for command "${this.location}`);
		}

		this.hidden = options.hidden ?? false;
		this.OwnerOnly = options.preconditions?.includes('OwnerOnly') ?? false;

		this.permissions = options.requiredUserPermissions ?? [];
		this.clientPermissions = options.requiredClientPermissions ?? [];

		this.client = this.container.client as MinervaClient;
	}

	public override registerApplicationCommands(registery: ApplicationCommandRegistry) {
		if (!this.options.chatInputCommand || !this.options.enabled) {
			return;
		}

		//const guildIds = [this.client.config.env.DEV_SERVER_ID as string].filter((str) => typeof str === 'string' && str.length);
		const options: ApplicationCommandRegistryRegisterOptions = {
			/* eslint no-restricted-globals: 0 */
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
		};

		if (this.options.chatInputCommand.messageCommand) {
			registery.registerChatInputCommand(
				{
					name: this.name,
					description: this.description,
					options: this.options.chatInputCommand.options
				},
				options
			);
		}
		if (this.options.chatInputCommand.contextmenu) {
			registery.registerContextMenuCommand(
				{
					name: this.name,
					type: this.options.chatInputCommand.contextmenu
				},
				options
			);
		}
	}

	protected error(options: UserError.Options): UserError {
		return new UserError(options);
	}
}

export namespace MinervaCommand {
	export type Options = SubCommandPluginCommand.Options & {
		hidden?: boolean;
		permissions?: PermissionResolvable;
		chatInputCommand?: {
			register?: boolean;
			options?: ApplicationCommandOptionData[];
			contextmenu?: 'MESSAGE' | 'USER';
			messageCommand?: boolean;
		};
	};

	export type Interaction<Cache extends CacheType = CacheType> = CommandInteraction<"cached">;
	export type Registry = ChatInputCommand.Registry;
	export type MessageContext = MessageCommandContext;
	export type SlashCommandContext = ChatInputCommandContext;
	export type AutoCompleteContext = AutocompleteCommandContext;
	export type MenuContext = ContextMenuCommandContext;
	export type Args = CommandArgs;
}
