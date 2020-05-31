import TelegramBot from "node-telegram-bot-api";

module.exports = (bot: TelegramBot) => ({
    pattern: /^\/echo (.+)/,
    command: (msg: TelegramBot.Message, match: RegExpExecArray) => {
        const { id } = msg.chat;
        const [, echo = ""] = match;
        bot.sendMessage(id, echo);
    }
});
