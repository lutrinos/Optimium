import { escapeMarkdown } from "discord.js";

export const unFormat = (str) => {
    return escapeMarkdown(str);
    return str.replace(/([\*_~`])/g, `\\$1`);
}