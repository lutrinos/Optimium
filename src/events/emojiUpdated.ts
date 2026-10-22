import { Events } from "discord.js";

import { logs, events } from '../config';
import createLogger from 'with-simple-logger';

const logger = createLogger(events.emojiUpdate.message);

export default {
    event: Events.GuildEmojiUpdate,
    callback: async (client, emoji) => {
        if (events.emojiUpdate.notify) {
            client.channels.cache.get(logs.channel).send(logger({ emoji }));
        }
    }
};