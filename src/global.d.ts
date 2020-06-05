import TelegramBot from "node-telegram-bot-api";

type Middleware = (next: () => void) => void;

type Commands = (
    bot: TelegramBot
) => {
    pattern: RegExp;
    command: (msg: TelegramBot.Message, match: RegExpMatchArray | null) => any;
};

export type Command = Commands & { middleware?: Middleware };
