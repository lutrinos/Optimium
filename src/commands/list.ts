import bcd from '@mdn/browser-compat-data';
import { SlashCommandBuilder, EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getChoices, getListEmbed, getListReply } from '@/utils/mdn';

export default {
    command: new SlashCommandBuilder()
        .setName('list_features')
        .setDescription('List all the features in a category.')
        .addSubcommand(option =>
            option
                .setName('css')
                .setDescription('List all css feature')
                .addBooleanOption(option =>
                    option
                        .setName('public')
                        .setDescription('Wether everyone can view the list and navigate in it.')
                )
                .addStringOption(type =>
                    type.setName('type')
                        .setDescription('CSS feature type')
                        .addChoices(...getChoices('css'))
                )
        )
        .addSubcommand(option =>
            option
                .setName('javascript')
                .setDescription('Check some javascript feature')
                .addBooleanOption(option =>
                    option
                        .setName('public')
                        .setDescription('Wether everyone can view the list and navigate in it.')
                )
                .addStringOption(type =>
                    type.setName('type')
                        .setDescription('Javascript feature type')
                        .addChoices(...getChoices('javascript'))
                )
        ),
    execute(client, interaction) {
        const part = interaction.options.getSubcommand();
        const type = interaction.options.getString('type');
        const ephemeral = interaction.options.getBoolean('public') ?? false;

        interaction.reply(getListReply({ part, type, ephemeral: !ephemeral, page: 1 }));
    }
}