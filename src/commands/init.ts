import { ModalBuilder } from "@discordjs/builders";
import { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export default {
    command: new SlashCommandBuilder()
        .setName('init')
        .setDescription('Init the guild and databases')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
    ,
    execute(client, interaction) {
        const modal = new ModalBuilder()
            .setCustomId('init')
            .setTitle('Tnit');
        
        modal.addComponents(
            new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('verify_init')
                        .setPlaceholder('Yes')
                        .setLabel('Are you sure? Some data will be lost (yes/no)')
                        .setStyle(TextInputStyle.Short)
                )
        );

        interaction.showModal(modal);
    }
};