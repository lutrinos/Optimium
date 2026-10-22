import { Channel, Client, Events } from "discord.js";

import { logs, events } from '../config';
import createLogger from 'with-simple-logger';

const logger = createLogger(events.channelCreate.message);

export default {
    event: Events.ChannelCreate,
    callback: async (client: Client, channel: Channel) => {
        if (events.channelCreate.notify) {
            client.guilds.cache.get(logs.guild).channels.cache.get(logs.channel).send(logger({ channel }));
        }
    }
};