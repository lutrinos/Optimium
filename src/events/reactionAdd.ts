import { Events } from "discord.js";
import config from "../config";
import { Messages } from "../utils/db";

export default {
    event: Events.MessageReactionAdd,
    async callback(client, reaction, user) {
        if (!reaction.me) {
            const msg = await Messages.get(reaction.message.id);
            if (msg) {
                const emoji = reaction._emoji.name;

                if (msg.emojis[emoji]) {
                    if (msg.type === 0) {
                        const role = reaction.message.guild.roles.cache.get(msg.emojis[emoji]);
                        if (!role) return;
                        (await reaction.message.guild.members.cache.get(user.id)).roles.add(role);
                    }
                } else {
                    reaction.remove();
                }
            }
        }
    }
};