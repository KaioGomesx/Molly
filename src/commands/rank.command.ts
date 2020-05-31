import TelegramBot from "node-telegram-bot-api";
import { getMsgId, getUser } from "../chat";
import { users, Users, Votes, UserVotes } from "../database";

const CommandMap = {
    add: async (user: string, bot: TelegramBot, msg: TelegramBot.Message) => {
        if (msg.reply_to_message) {
            const { id } = msg.chat;
            Users.save(user, msg);
            const list = await Users.getAll();
            bot.sendMessage(id, `${list.length} usuários cadastrados`, {
                reply_to_message_id: getMsgId(msg),
                parse_mode: "Markdown"
            });
        }
    },
    list: async (_: any, bot: TelegramBot, msg: TelegramBot.Message) => {
        const { id } = msg.chat;
        const users = await UserVotes.allVotes();
        const txt = Object.values(users).reduce(
            (text, user) => text + `${user.troll}, ${user.distinction}. ${user.ups} votos\n`,
            ""
        );
        bot.sendMessage(id, txt);
    },
    up: async (user: string, bot: TelegramBot, msg: TelegramBot.Message) => {
        const [troll] = await users().where("rankingName", "=", user.trim()).limit(1);
        if (troll) {
            const voter = getUser(msg);
            await Votes.vote("UP", troll, `${voter?.id}`);
            const { id } = msg.chat;
            bot.sendMessage(id, `@${voter?.username} votou em ${user}`);
        }
    },
    ban: async (user: string, bot: TelegramBot, msg: TelegramBot.Message) => {
        const [troll] = await users().where("rankingName", "=", user.trim()).limit(1);
        if (troll) {
            const voter = getUser(msg);
            await Votes.vote("BAN", troll, `${voter?.id}`);
            const { id } = msg.chat;
            bot.sendMessage(id, `@${voter?.username} deu banVote em ${user}`);
        }
    },
};

type Commands = typeof CommandMap;

module.exports = (bot: TelegramBot) => ({
    pattern: /^\/rank (add|list|ban|up)( @\w+)?$/,
    command: async (msg: TelegramBot.Message, match: RegExpExecArray) => {
        const [, fn, user]: [never, keyof Commands, string] = match as any;
        CommandMap[fn](user, bot, msg);
    }
});
