import glob from "glob";
import TelegramBot from "node-telegram-bot-api";
import { join } from "path";
import { Document } from "./domain/document";
require("dotenv").config();

const TOKEN: string = process.env.BOT_TOKEN as never;
const bot = new TelegramBot(TOKEN, { polling: true });

const COMMANDS = join(process.cwd(), "src", "commands", "*.command.ts");

/*
    Command files
*/
glob(COMMANDS, (_, files) => {
    files.map((file) => {
        const func = require(file);
        const cmd = func(bot);
        bot.onText(cmd.pattern, cmd.command);
    });
});

/*
    Custom commands without onText trigger\
 */
bot.on("document", (msg) => {
    const message = new Document(msg);
    const { id } = msg.chat;
    bot.sendDocument(id, message.fileId, {
        parse_mode: "Markdown",
        caption: message.filename
    });
});
2;
