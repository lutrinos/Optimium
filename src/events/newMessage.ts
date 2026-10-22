import { Events } from "discord.js";
import config from "../config";
import filter from '@/utils/filter';

import createLogger from 'with-simple-logger';
import { unFormat } from "@/utils";
const cleanedMessage = createLogger(config.filter.message);

export default {
    event: Events.MessageCreate,
    async callback(client, message) {
        if (message.author.bot === client.user.id) return;
        
        // checks for mention
        if (message.mentions.has(client.user.id)) {
            message.reply(config.sentences.hello[Math.floor(Math.random() * config.sentences.hello.length)]);
        }

        // checks for profanity
        if (config.filter.enabled) {
            const cleaned = filter.clean(message.content);

            if (cleaned !== message.content) {

                if (config.filter.message) {
                    message.channel.send(cleanedMessage({ message, cleaned: cleaned }));
                }

                await message.delete();
            }
        }
    }
};