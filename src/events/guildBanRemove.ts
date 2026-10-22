import { Events } from "discord.js";

import { logs, events } from '../config';
import createLogger from 'with-simple-logger';

const logger = createLogger(events.guildBanRemove.message);

export default {
    event: Events.GuildBanRemove,
    callback: async (client, user) => {
        if (events.guildBanRemove.notify) {
            client.channels.cache.get(logs.channel).send(logger({ user: user.user }));
        }
    }
};