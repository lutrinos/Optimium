import { Events } from "discord.js";

import { logs, events } from '../config';
import createLogger from 'with-simple-logger';

const logger = createLogger(events.channelUpdate.message);

export default {
    event: Events.ChannelUpdate,
    callback: async (client, channel) => {
        if (events.channelUpdate.notify) {
            client.guilds.cache.get(logs.guild).channels.cache.get(logs.channel).send(logger({ channel }));
        }
    }
};