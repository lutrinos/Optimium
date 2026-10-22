import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";

export default {
    disabled: true
    /*
    command: new SlashCommandBuilder()
        .setName('pool')
        .setDescription('Create a pool')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addStringOption(option =>
            option
                .setName('question')
                .setDescription('The question to ask')
                .setRequired(true)
        ),
    async execute (client, interaction) {
        await interaction.deferReply();
        const question = interaction.options.getString('question');
        const author = interaction.user;

        const embed = new EmbedBuilder()
            .setFooter({ text: `Pool from ${author.username} (${author.id})`, iconURL: author.displayAvatarURL() })
            .setTitle('Pool')
            .setColor("LuminousVividPink")
            .setDescription(`**${question}**`);
        
        interaction.editReply({ embeds: [embed] });
    }*/
}