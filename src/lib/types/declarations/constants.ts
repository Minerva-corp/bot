import { pathToFileURL } from 'node:url';
import { getRootData } from '@sapphire/pieces';

export const rootURL = pathToFileURL(`${getRootData().root}/`);

export enum MessageComponentTypes {
    ACTION_ROW = 1,
    BUTTON = 2,
    SELECT_MENU = 3
}

export enum InteractionTypes {
    PING = 1,
    APPLICATION_COMMAND = 2,
    MESSAGE_COMPONENT = 3,
    APPLICATION_COMMAND_AUTOCOMPLETE = 4
}

export type MessageInteractionAction = "editReply" | "followUp" | "reply";