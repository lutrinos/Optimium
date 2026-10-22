import { Events } from "discord.js";

import { logs, events } from '../config';
import createLogger from 'with-simple-logger';

const logger = createLogger(events.roleDelete.message);

export default {
    event: Events.GuildRoleDelete,
    callback: async (client, role) => {
        if (events.roleDelete.notify) {
            client.channels.cache.get(logs.channel).send(logger({ role }));
        }
    }
};