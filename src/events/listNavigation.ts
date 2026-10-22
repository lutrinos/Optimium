import { Events } from "discord.js";
import { getListReply } from "@/utils/mdn";

export default {
    event: Events.InteractionCreate,
    async callback (client, interaction) {
        if (!interaction.isButton() || !['list_prev', 'list_next', 'list_last', 'list_first'].includes(interaction.customId)) return;

        const message = await interaction.message.fetch();
        const ephemeral = message.ephemeral;
        const [_, part, type] = /^([^ \n]+)(?: \/ ([^ \n]+))?/.exec(message.embeds[0].data.title);
        let [page, pages] = message.embeds[0].data.footer.text.match(/[0-9]+/g);

        if (interaction.customId === 'list_prev') {
            page--;
        } else if (interaction.customId === 'list_next') {
            page++;
        } else if (interaction.customId === 'list_last') {
            page = parseInt(pages);
        } else  if (interaction.customId === 'list_first') {
            page = 1;
        }

        await message.edit(getListReply({ part, type, page, ephemeral }));
        await interaction.deferUpdate();
    }
}