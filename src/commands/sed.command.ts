import TelegramBot from "node-telegram-bot-api";

export default (bot: TelegramBot) => ({
    pattern: /^s\/(.*?)\/(.*?)\/?$/,
    command: (msg: TelegramBot.Message, match: RegExpMatchArray) => {
        const replyMsg = msg.reply_to_message;
        if (!replyMsg) {
            return;
        }
        const [, find, replace] = match;
        const { id } = msg.chat;
        const regex = new RegExp(find, "g");
        const newMessage = replyMsg.text?.replace(regex, replace);
        const opts = {
            reply_to_message_id: replyMsg.message_id,
            parse_mode: "Markdown" as const
        };
        bot.sendMessage(id, `*Você quis dizer:*\n"${newMessage}"`, opts);
    }
});
