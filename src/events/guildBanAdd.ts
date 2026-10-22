import { Events } from "discord.js";

import { logs, events } from '../config';
import createLogger from 'with-simple-logger';

const logger = createLogger(events.guildBanAdd.message);

export default {
    event: Events.GuildBanAdd,
    callback: async (client, user) => {
        if (events.guildBanAdd.notify) {
            client.channels.cache.get(logs.channel).send(logger({ user: user.user }));
        }
    }
};