import glob from "glob";
import TelegramBot from "node-telegram-bot-api";
import { join } from "path";
import { Document } from "./domain/document";
import { Command } from "./global";
import { getMsgId } from "./chat";
require("dotenv").config();

const TOKEN: string = process.env.BOT_TOKEN as never;
const bot = new TelegramBot(TOKEN, { polling: true });

const COMMANDS = join(process.cwd(), "src", "commands", "*.command.ts");

/*
    Command files
*/
glob(COMMANDS, (_, files) => {
    files.map((file) => {
        const func: Command = require(file).default;
        const exec = func(bot);
        bot.onText(exec.pattern, exec.command);
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

bot.on("text", (e) => {
    const id = getMsgId(e);
    const rand1 = Math.floor(Math.random() * Math.floor(6));
    const rand = Math.floor(Math.random() * Math.floor(6));
});
