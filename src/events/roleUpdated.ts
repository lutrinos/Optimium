import { Events } from "discord.js";

import { logs, events } from '../config';
import createLogger from 'with-simple-logger';

const logger = createLogger(events.roleUpdate.message);

export default {
    event: Events.GuildRoleUpdate,
    callback: async (client, role) => {
        if (events.roleUpdate.notify) {
            client.channels.cache.get(logs.channel).send(logger({ role }));
        }
    }
};