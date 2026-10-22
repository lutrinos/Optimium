import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { search } from '@/utils/spotify';

export default {
    command: new SlashCommandBuilder()
        .setName('playlist')
        .setDescription('Search for an playlist on Spotify')
        .addStringOption(option =>
            option
                .setName('playlist')
                .setDescription('The playlist\'s name')
                .setRequired(true)
        ),
    async execute(client, interaction) {
        const playlist = interaction.options.getString('playlist');

        search(playlist, 'playlist')
            .then(({ playlists }) => {
                let arr = [];

                playlists.items.forEach((item) => {
                    arr.push({
                        label: (item.name).substring(0, 90),
                        value: item.external_urls.spotify
                    });
                });

                const row = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('select_music')
                            .setPlaceholder('Nothing selected')
                            .addOptions(arr),
                    );

                interaction.reply({ content: `Results for \`${playlist}\``, components: [row] });
            })
            .catch((err) => {
                interaction.reply(` **An error occured:** \`${err}\``);
            });
    },
};