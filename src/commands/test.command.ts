import TelegramBot from "node-telegram-bot-api";

module.exports = (bot: TelegramBot) => ({
    pattern: /.*teste?/,
    command: (msg: TelegramBot.Message, match: RegExpMatchArray) => {
        const replyMsg = msg.message_id;
        if (!replyMsg) {
            return;
        }
        const { id } = msg.chat;
        bot.sendDocument(id, "./data/gif.gif", {
            reply_to_message_id: replyMsg,
            parse_mode: "Markdown",
        });
    },
});
