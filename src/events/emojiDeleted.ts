import { Events } from "discord.js";

import { logs, events } from '../config';
import createLogger from 'with-simple-logger';

const logger = createLogger(events.emojiDelete.message);

export default {
    event: Events.GuildEmojiDelete,
    callback: async (client, emoji) => {
        if (events.emojiDelete.notify) {
            client.channels.cache.get(logs.channel).send(logger({ emoji }))
        }
    }
};