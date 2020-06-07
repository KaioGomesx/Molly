import TelegramBot from "node-telegram-bot-api";

export default (bot: TelegramBot) => ({
    pattern: /^\/help$/,
    command: (msg: TelegramBot.Message) => {
        const { id } = msg.chat;
        bot.sendMessage(id, "Se vira makako, baiano");
    }
});
