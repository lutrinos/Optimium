import { Events } from "discord.js";
import { Users } from "../database";

import { logs, events } from '../config';
import createLogger from 'with-simple-logger';

const logger = createLogger(events.memberJoin.message);

export default {
    event: Events.GuildMemberAdd,
    callback: async (client, member) => {

        if (events.memberJoin.notify) {
            client.channels.cache.get(logs.channel).send(logger({ member }));
        }

        Users.get(member.id)
            .then((m) => {
                if (!m) {
                    Users.set(member.id, {
                        warnsCount: 0,
                        xp: 0,
                        last: null,
                        cookies: 0
                    });
                }
            })
    }
};