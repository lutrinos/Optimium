import { SlashCommandBuilder } from 'discord.js';

export default {
	command: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(client, interaction) {
		await interaction.reply('Pong!');
	},
};