import { ButtonInteraction, CommandInteraction, ContextMenuInteraction, Interaction, InteractionReplyOptions, Message, MessageActionRow, MessageButton, MessageOptions, MessagePayload, SelectMenuInteraction } from "discord.js";
import { InteractionTypes, MessageComponentTypes, MessageInteractionAction } from "#types/declarations/constants";
import type { Args } from "@sapphire/framework";

export class CommandContext {    
    public constructor(public readonly context:
        | CommandInteraction<"cached">
        | ContextMenuInteraction
        | Interaction
        | Message
        | SelectMenuInteraction,
        public args: Args
    ) {}


    public author = this.isInteraction() ? (this.context as Interaction).user : (this.context as Message).author;
    public channel = this.context.channel;
    public options = this.context instanceof CommandInteraction ? this.context.options : undefined;

    public async deferReply(): Promise<void> {
        if (this.isInteraction()) {
            return (this.context as CommandInteraction).deferReply();
        }
        return Promise.resolve(undefined);
    }

    public async reply(
        options:
        | InteractionReplyOptions
        | MessageOptions
        | MessagePayload
        | string,
        autoedit?: boolean
    ): Promise<Message | void> {
        if (this.isInteraction()) {
            if (
                ((this.context as Interaction).isCommand() || (this.context as Interaction).isSelectMenu()) &&
                (this.context as CommandInteraction).replied &&
                !autoedit
            )
                this.context.client.logger.fatal('Interaction is already replied.')
        }

        const context = this.context as CommandInteraction | Message | SelectMenuInteraction;
        const rep = await this.send(
            options,
            this.isInteraction()
                ? (context as Interaction).isCommand() || (context as Interaction).isSelectMenu()
                    ? (context as CommandInteraction).replied || (context as CommandInteraction).deferred
                        ? "editReply"
                        : "reply"
                    : "reply"
                : "reply"
        ).catch(e => ({ error: e }));
        if (!rep || "error" in rep) {
            this.context.client.logger.fatal(`Unable to reply context, because: ${rep ? (rep.error as Error).message : "Unknown"}`)
        }
         // @ts-expect-error-next-line
        return rep instanceof Message ? rep : new Message(this.context.client, rep);
    }

    public async send(
        options:
            | InteractionReplyOptions
            | MessageOptions
            | MessagePayload
            | string
            | { askDeletion?: { reference: string } },
        type: MessageInteractionAction = "editReply"
    ): Promise<Message| void> {
        const deletionBtn = new MessageActionRow().addComponents(new MessageButton().setLabel('REMOVE').setEmoji("🗑️").setStyle("DANGER"));
        if ((options as { askDeletion?: { reference: string } }).askDeletion) {
            deletionBtn.components[0].setCustomId(
                Buffer.from(
                    `${(options as { askDeletion: { reference: string } }).askDeletion.reference}_delete-msg`
                ).toString("base64")
            );
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            (options as InteractionReplyOptions).components
                ? (options as InteractionReplyOptions).components!.push(deletionBtn)
                : ((options as InteractionReplyOptions).components = [deletionBtn]);
        }
        if (this.isInteraction()) {
            (options as InteractionReplyOptions).fetchReply = true;
            const msg = (await (this.context as CommandInteraction)[type](
                options as InteractionReplyOptions | MessagePayload | string
            )) as Message;
            const channel = this.context.channel;
            const res = await channel!.messages.fetch(msg.id).catch(() => null);
            return res ?? msg;
        }
        if ((options as InteractionReplyOptions).ephemeral) {
            this.context.client.logger.fatal("Cannot send ephemeral message in a non-interaction context.");
        }
        return this.context.channel!.send(options as MessageOptions | MessagePayload | string);
    }

    public isInteraction(): boolean {
        return this.isCommand() || this.isContextMenu() || this.isMessageComponent() || this.isButton() || this.isSelectMenu();
    }

    public isCommand(): boolean {
        // @ts-expect-error-next-line
        return InteractionTypes[this.context.type as InteractionType] === InteractionTypes.APPLICATION_COMMAND && typeof (this.context as unknown as { targetId: string | undefined }).targetId === "undefined";
    }

    public isMessageCommand(): boolean {
        return this.context instanceof Message;
    }

    public isContextMenu(): boolean {
        // @ts-expect-error-next-line
        return InteractionTypes[this.context.type] === InteractionTypes.APPLICATION_COMMAND && typeof (this.context as unknown as { targetId: string | undefined }).targetId !== "undefined";
    }

    public isMessageComponent(): boolean {
        // @ts-expect-error-next-line
        return InteractionTypes[this.context.type] === InteractionTypes.MESSAGE_COMPONENT;
    }

    public isButton(): boolean {
        return (
            // @ts-expect-error-next-line
            InteractionTypes[this.context.type] === InteractionTypes.MESSAGE_COMPONENT &&
            MessageComponentTypes[(this.context as unknown as ButtonInteraction).componentType] === MessageComponentTypes.BUTTON
        );
    }

    public isSelectMenu(): boolean {
        return (
            // @ts-expect-error-next-line
            InteractionTypes[this.context.type] === InteractionTypes.MESSAGE_COMPONENT &&
            MessageComponentTypes[(this.context as unknown as SelectMenuInteraction).componentType] === MessageComponentTypes.SELECT_MENU
        );
    }
}