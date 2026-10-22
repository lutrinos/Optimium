import { SlashCommandBuilder, EmbedBuilder, Client, ChatInputCommandInteraction } from 'discord.js';
import wd from 'word-definition';

type Language = 'en' | 'fr' | 'es' | 'de';

const translations = {
    title: {
        en: 'Definition of ',
        fr: 'Définition de ',
        de: 'Definition von ',
        es: 'Definición de '
    },
    category: {
        en: 'Category',
        fr: 'Catégorie',
        es: 'Categoría',
        de: 'Kategorie'
    },
    exists: {
        en: 'This word doesn\'t exists.',
        fr: 'Ce mot n\'existe pas.',
        de: 'Dieses Wort existiert nicht.',
        es: 'Esa palabra no existe.'
    }
}

function getEmbed(result: any, lang: Language) {
    return new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${translations.title[lang] ?? translations.title.en} \`${result.word.replace(/`/g, '\\`')}\``)
        .setDescription(
            result.err
            ? (translations.exists[lang] ?? translations.exists.en)
            : `${result.definition}\n\n**${translations.category[lang] ?? translations.category.en} :** ${result.category}`
        );
}

export default {
    command: new SlashCommandBuilder()
        .setName('define')
        .setDescription('Retrieve the definition of a word.')
        .addStringOption(option =>
            option
                .setName('word')
                .setDescription('The word to define')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('language')
                .setDescription('The language (default to english)')
                .setRequired(false)
                .addChoices(
                    { name: 'English', value: 'en' },
                    { name: 'Français', value: 'fr' },
                    { name: 'Deutsch', value: 'de' },
                    // { name: 'Español', value: 'es' }
                )),
    execute(client: Client, interaction: ChatInputCommandInteraction) {
        const word = interaction.options.getString('word');
        const lang = interaction.options.getString('language') ?? 'en';

        wd.getDef(word, lang, {
                exact: false
            },
            (result: any) => {
                interaction.reply({ embeds: [getEmbed(result, lang as Language)] });
            }
        )
    },
};