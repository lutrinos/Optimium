import { Events } from "discord.js";
import config from "../config";

export default {
    event: Events.InteractionCreate,
    callback: (client, interaction) => {
        if (!interaction.isStringSelectMenu()) return;

        if (interaction.customId === 'select_music') {
            interaction.reply(interaction.values[0]);
        }
    }
};