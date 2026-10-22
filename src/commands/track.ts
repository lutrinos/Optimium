import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { search } from '@/utils/spotify';

export default {
    command: new SlashCommandBuilder()
        .setName('play_track')
        .setDescription('Search for a track on Spotify')
        .addStringOption(option =>
            option
                .setName('track')
                .setDescription('The track\'s title')
                .setRequired(true)
        ),
    async execute(client, interaction) {
        const track = interaction.options.getString('track');

        search(track, 'track')
            .then(({ tracks }) => {
                let arr = [];

                tracks.items.forEach((item) => {
                    arr.push({
                        label: (item.name).substring(0, 90),
                        description: item.artists.map(i=> i.name).join(', ').substring(0, 90),
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

                interaction.reply({ content: `Results for \`${track}\``, components: [row] });
            })
            .catch((err) => {
                interaction.reply(` **An error occured:** \`${err}\``);
            });
    },
};