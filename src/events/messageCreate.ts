import { Client, Events, Message } from "discord.js";
import config from "../config";
import filter from '@/utils/filter';
import transfers from '@/utils/transfers';
import database from "@/utils/db";


import createLogger from 'with-simple-logger';
import { unFormat } from "@/utils";
import log from "@/utils/log";
const cleanedMessage = createLogger(config.filter.message);

function copyMessage(message) {
    const files = [];

    for (let file of message.attachments) {
        files.push(file[1]);
    }

    return {
        content: message.content,
        components: message.components,
        files: files,
        embeds: message.embeds
    };
}

export default {
    event: Events.MessageCreate,
    async callback(client: Client, message: Message) {
        if (!client.user) return;

        if (message.author.bot || client.user.id == message.author.id) return;
        
        // checks for mention
        if (message.mentions.has(client.user.id)) {
            message.reply(config.sentences.hello[Math.floor(Math.random() * config.sentences.hello.length)]);
        }

        // checks for profanity
        if (config.filter.enabled) {
            const cleaned = filter.clean(message.content);

            if (cleaned !== message.content) {

                if (config.filter.message) {
                    message.channel.send(cleanedMessage({ message, cleaned: cleaned }));
                }

                await message.delete();
            }
        }

        // checks for dms
        try {
            if (message.channel.isDMBased()) {
                transfers.createJob({
                    type: 'from-dms',
                    user: {
                        username: message.author.username,
                        discriminator: message.author.discriminator,
                        id: message.author.id
                    },
                    message: copyMessage(message)
                }, message.client);
            }

            // if it's in a response thread, we send the message to the user
            if (message.channel.isThread() && message.channel.ownerId === message.client.user.id) {
                const userId = message.channel.name.split(' ').at(-1);

                if (userId === message.client.user.id) {
                    return;
                }

                if (await database.Dms.get(userId)) {
                    transfers.createJob({
                        type: 'to-dms',
                        message: copyMessage(message),
                        user: {
                            id: userId,
                        }
                    }, message.client);
                }

            }

        } catch (err) {
            log('error', 'Unable to transfer message.\nReason:', err);
        }
    }
};