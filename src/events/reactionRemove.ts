import { Messages } from "../database";
import { Events } from "discord.js";
import config from "../config";

export default {
    event: Events.MessageReactionRemove,
    async callback (client, reaction, user) {
        if (!reaction.me) {
            const msg = await Messages.get(reaction.message.id);
            if (msg) {
                const emoji = reaction._emoji.name;
                
                if (msg.emojis[emoji]) {
                    const role = reaction.message.guild.roles.cache.get(msg.emojis[emoji]);
                    if (!role) return;
                    (await reaction.message.guild.members.cache.get(user.id)).roles.remove(role);
                }
            }
        }
    }
};