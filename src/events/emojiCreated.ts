import { Events } from "discord.js";

import { logs, events } from '../config';
import createLogger from 'with-simple-logger';

const logger = createLogger(events.emojiCreate.message);

export default {
    event: Events.GuildEmojiCreate,
    callback: async (client, emoji) => {
        if (events.emojiCreate.notify) {
            client.channels.cache.get(logs.channel).send(logger({ emoji }));
        }
    }
};