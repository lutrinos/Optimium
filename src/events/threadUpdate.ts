import { Client, Events, ThreadChannel } from "discord.js";
import config from "../config";
import database from "@/utils/db";

export default {
    event: Events.ThreadUpdate,
    async callback(client: Client, oldThread: ThreadChannel, newThread: ThreadChannel) {
        if (!client.user) return;
        
        const user = oldThread.name.split(' ').at(-1);

        if (oldThread?.ownerId !== client.user.id || !user) {
            return;
        }

        if (newThread.locked && !oldThread.locked) {
            await database.Dms.set(user, {
                threadId: null
            });
        }

        if (!newThread.locked && oldThread.locked) {
            await database.Dms.set(user, {
                threadId: newThread.id
            });
        }
    }
};