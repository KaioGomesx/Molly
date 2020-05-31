import TelegramBot from "node-telegram-bot-api";
import { getReply } from "../chat";

module.exports = (bot: TelegramBot) => ({
    pattern: /^\/(bonit(o|[aã]o))( @\w+)?$/,
    command: (msg: TelegramBot.Message, match: RegExpMatchArray) => {
        const nick = match[3] || "";
        const { id } = msg.chat;
        const replyUser = (getReply(msg)?.username || nick).replace(/^@/g, "").trim();
        const text = `@${replyUser} está bonitão hoje`.replace(/@+/, "@");
        bot.sendMessage(id, text);
    }
});
