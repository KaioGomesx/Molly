import TelegramBot from "node-telegram-bot-api";

const xingamentos = [
    "Se fuder @K4teOrNot",
    "Foda-se o @K4teOrNot",
    "Uspzero viado @K4teOrNot",
    "Paulista bunda branca @K4teOrNot"
];

export default (bot: TelegramBot) => ({
    pattern: /^\/usp/,
    command: (msg: TelegramBot.Message) => {
        const { id } = msg.chat;
        const txt = xingamentos[Math.floor(Math.random() * xingamentos.length)];
        bot.sendMessage(id, txt);
    }
});
