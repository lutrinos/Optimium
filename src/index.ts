import 'dotenv/config';

import { Client, Events, IntentsBitField, Collection, Partials, ActivityType, REST, Routes, SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import database from './database';
import filter from './utils/filter';
import transfers from './utils/transfers';

import log from "@/utils/log";

log('info', 'Database loaded', Object.keys(database).join(', '))
log('info', filter.clean('The filter is working.'));

const client = new Client({
    intents: new IntentsBitField(3276799),
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});



// settings the modals
const modals = new Collection();

fs.readdirSync(`${__dirname}/modals`)
    .map(async (i) => {
        const m = await import(`./modals/${i}`);
        modals.set(m.id, m.execute);
    });

// settings the commands
const commands = new Collection();

const listOfCommands = (await Promise.all(fs.readdirSync(`${__dirname}/commands`)
    .map(async (i) => {
        const rawCommand = await import(`./commands/${i}`);
        const c = rawCommand.default;

        if (c.disabled) return;
        
        commands.set(c.command.name, c.execute);

        return c.command;
    }))).filter(Boolean);


// creating the events
const events = fs.readdirSync(`${__dirname}/events`).map(async (i) => await import(`./events/${i}`));

// const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

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

client.on(Events.UserUpdate, (oldUser, newUser) => {
});


client.once(Events.ClientReady, (bot) => {
    log('info', `Logged in as ${bot.user.tag}`);

    if (client.user) {
        log('info', 'New user status : Watching');
        client.user.setActivity({
            type: ActivityType.Watching,
            name: 'you'
        });
    }

    // for messages
    bot.on(Events.MessageCreate, async (message) => {


        // if the author is a bot, or is a reply to an interaction we don't transfer the message
        if (message.author.bot || message.interaction) {
            return;
        }

        try {
            // if it's a dm
            if (message.channel.isDMBased()) {
                transfers.createJob({
                    type: 'from-dms',
                    user: {
                        username: message.author.username,
                        discriminator: message.author.discriminator,
                        id: message.author.id
                    },
                    message: copyMessage(message)
                }, client);
            }

            // if it's in a response thread, we send the message to the user
            if (message.channel.isThread() && message.channel.ownerId === bot.user.id) {
                const userId = message.channel.name.split(' ').at(-1);

                if (userId === bot.user.id) {
                    return;
                }

                if (await database.Dms.get(userId)) {
                    transfers.createJob({
                        type: 'to-dms',
                        message: copyMessage(message),
                        user: {
                            id: userId,
                        }
                    }, client);
                }

            }

        } catch (err) {
            console.log('Unable to transfer message.\nReason:', err);
        }
    });

    bot.on(Events.ThreadUpdate, async (oldThread, newThread) => {
        const user = oldThread.name.split(' ').at(-1);

        if (oldThread?.ownerId !== bot.user.id || !user) {
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
    });



    // for slash commands
    bot.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return;

        console.log(interaction.commandName);

        const command = commands.get(interaction.commandName);

        if (!command) return interaction.reply('I can\'t find this command.');

        try {
            await command(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    });

    // for modals
    bot.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isModalSubmit()) return;

        const modal = modals.get(interaction.customId);

        if (!modal) return;
        try {
            await modal(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    });
    events.forEach((i) => {
        //bot.on(i.event, i.callback.bind(null, client));
    });

    client.application?.commands.set(listOfCommands)
        .then(() => log('info', 'Slash command registred'))
        .catch((err) => log('error', 'Unable to register slash commands', err));
});

client.login(process.env.BOT_TOKEN);