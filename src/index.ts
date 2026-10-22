import 'dotenv/config';

import { Client, Events, IntentsBitField, Collection, Partials, ActivityType, REST, Routes, SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import database from '@/utils/db';
import log from "@/utils/log";

log('info', 'Database ready.', Object.keys(database).join(', '));

const client = new Client({
    intents: new IntentsBitField(3276799),
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// --- MODALS ---
const modals = new Collection();

await Promise.all(
    fs.readdirSync(`${__dirname}/modals`)
    .map(async (i) => {
        const m = await import(`./modals/${i}`);
        modals.set(m.default.id, m.default.execute);
    })
);

log('info', 'Modals ready.', modals.map((_, k) => k).join(', '));


// --- COMMANDS ---
const commands = new Collection();
const listOfCommands: SlashCommandBuilder[] = [];

await Promise.all(
    fs.readdirSync(`${__dirname}/commands`).map(async (i) => {
        const rawCommand = await import(`./commands/${i}`);
        const c = rawCommand.default;

        if (c.disabled) return;
        
        commands.set(c.command.name, c.execute);

        listOfCommands.push(c.command);
    })
);

log('info', 'Commands ready.', listOfCommands.map((c) => c.name).join(', '));


// --- EVENTS ---
const events: any[] = []

await Promise.all(
    fs.readdirSync(`${__dirname}/events`).map(async (i) => {
        const e = await import(`./events/${i}`);

        events.push(e.default)
    })
);

log('info', 'Events ready.', events.map((e) =>  e.event).join(', '));


client.once(Events.ClientReady, (bot) => {
    log('info', `Client ready : logged in as ${bot.user.tag}`);

    // if (client.user) {
    //     log('info', 'New user status : Watching');
    //     client.user.setActivity({
    //         type: ActivityType.Watching,
    //         name: 'you'
    //     });
    // }


    // --- SLASH COMMANDS INTERACTIONS ---
    bot.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return;

        const command = commands.get(interaction.commandName);

        if (!command) return interaction.reply('I can\'t find this command.');

        try {
            // @ts-expect-error
            await command(client, interaction);
        } catch (error) {
            log('error', 'Error at InteractionCreate (slash command) : ' + interaction.commandName, error);
            if (!interaction.replied) {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    });

    // --- MODAL INTERACTIONS ---
    bot.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isModalSubmit()) return;

        const modal = modals.get(interaction.customId);

        if (!modal) return;
        try {
            // @ts-expect-error
            await modal(client, interaction);
        } catch (error) {
            log('error', 'Error at InteractionCreate (modal)', error);
            if (!interaction.replied) {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    });

    // listening for events
    events.forEach((event) => {
        if (event.event && event.callback) {
            bot.on(event.event, event.callback.bind(null, client));
        }
    });

    // registring slash commands
    client.application?.commands.set(listOfCommands)
        .then(() => log('info', 'Slash command registred'))
        .catch((err) => log('error', 'Unable to register slash commands', err));
});

client.login(process.env.BOT_TOKEN);