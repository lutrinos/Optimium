import { ChatInputCommandInteraction, Client, EmbedBuilder, escapeMarkdown, SlashCommandBuilder } from "discord.js";

export default {
    command: new SlashCommandBuilder()
        .setName('wiki')
        .setDescription('Browse Wikipedia')
        .addStringOption(option =>
            option
                .setName('title')
                .setDescription('The title of the article')
                .setRequired(true)
                .setMinLength(1)
        )
        .addStringOption(option =>
            option
                .setName('language')
                .setDescription('Wikipedia language')
                .setRequired(false)
        ),
    execute(client: Client, interaction: ChatInputCommandInteraction) {
        const title = interaction.options.getString('title') ?? '';
        const language = interaction.options.getString('language') ?? 'fr';

        fetch(`https://${language}.wikipedia.org/api/rest_v1/page/summary/${title}`)
            .then(res => res.json())
            .then(async data => {
                if (data.type === 'standard') {
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0x0099FF)
                                .setTitle(escapeMarkdown(data.title))
                                .setImage(data.thumbnail?.source ?? 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Wikipedia-logo-v2-square.svg/langfr-120px-Wikipedia-logo-v2-square.svg.png')
                                .setDescription(escapeMarkdown(data.extract))
                                .setURL(data.content_urls?.desktop?.page)
                                .setTimestamp(Date.parse(data.timestamp))
                                .setFooter({
                                    text: data.content_urls?.desktop?.page 
                                })
                        ]
                    })
                } else {
                    const res = await fetch(`https://${language}.wikipedia.org/w/rest.php/v1/search/title?q=${encodeURIComponent(title)}&limit=10`);
                    const data = await res.json();

                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0x0099FF)
                                .setTitle(`_${escapeMarkdown(title)}_`)
                                .setDescription(
                                    data.pages
                                        .map((i: any) => {
                                            return `**${escapeMarkdown(i.title)}** (${escapeMarkdown(i.description)})`
                                        })
                                        .join('\n')
                                )
                                .setFooter({
                                    text: `https://${language}.wikipedia.org/w/index.php?search=${encodeURIComponent(title)}`
                                })
                        ]
                    })
                }
            })
            .catch(() => {
                interaction.reply('An error occured');
            })
    }
}