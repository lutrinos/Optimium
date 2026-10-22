import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { setTimeout as wait } from 'node:timers/promises';

export default {
    command: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Say something')
        .addStringOption(option =>
            option
                .setName('sentence')
                .setDescription('The sentence')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(client, interaction) {
        await interaction.channel.send(interaction.options.getString('sentence'));

        await interaction.reply({ content: 'Done!', ephemeral: true });
        await wait(2000);
        await interaction.deleteReply();
    },
};