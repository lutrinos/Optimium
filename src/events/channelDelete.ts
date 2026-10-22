import { Events } from "discord.js";

import { logs, events } from '../config';
import createLogger from 'with-simple-logger';

const logger = createLogger(events.channelDelete.message);

export default {
    event: Events.ChannelDelete,
    callback: async (client, channel) => {
        if (events.channelDelete.notify) {
            client.guilds.cache.get(logs.guild).channels.cache.get(logs.channel).send(logger({ channel }));
        }
    }
};