import TelegramBot from "node-telegram-bot-api";

type Options = Partial<{
    reply: string;
}>;

export default class Bot {
    private bot: TelegramBot;
    public constructor(public token: string) {
        const TOKEN: string = token || (process.env.BOT_TOKEN as never);
        this.bot = new TelegramBot(TOKEN, { polling: true });
    }

    public message(chat: string, message: string, options?: Options) {
        
    }
}
