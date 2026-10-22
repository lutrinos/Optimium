import { Events } from "discord.js";

import { logs, events } from '../config';
import createLogger from 'with-simple-logger';

const logger = createLogger(events.roleCreate.message);

export default {
    event: Events.GuildRoleCreate,
    callback: async (client, role) => {
        if (events.roleCreate.notify) {
            client.channels.cache.get(logs.channel).send(logger({ role }));
        }
    }
};