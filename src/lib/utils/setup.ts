import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { ApplicationCommandRegistries, container, Piece, RegisterBehavior } from '@sapphire/framework';
import '@sapphire/plugin-logger/register';
import 'dotenv/config';
import 'reflect-metadata';

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);
PaginatedMessage.wrongUserInteractionReply = (user) => `❌ Only ${user} can use these buttons!`;
Object.defineProperty(Piece.prototype, 'client', { get: () => container.client });
