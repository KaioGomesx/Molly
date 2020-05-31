import TelegramBot from "node-telegram-bot-api";

export const getMsgId = (msg: TelegramBot.Message) => msg.message_id;

export const getId = (msg: TelegramBot.Message) => msg.chat;

export const getUser = (msg: TelegramBot.Message) => msg.from;

export const getReply = (msg: TelegramBot.Message) => msg.reply_to_message?.from;
