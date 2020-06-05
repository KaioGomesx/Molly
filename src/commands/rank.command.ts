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
        const txt = users.reduce(
            (text, user) =>
                text + `<a href="tg://user?id=${user.id}">${user.troll}</a>, ${user.distinction}. ${user.ups} votos\n`,
            "<b>Brabo List</b>\n"
        );
        bot.sendMessage(id, txt, { parse_mode: "HTML" });
    },
    banList: async (_: any, bot: TelegramBot, msg: TelegramBot.Message) => {
        const { id } = msg.chat;
        const users = await UserVotes.allBans();
        const txt = users.reduce(
            (text, user) =>
                text + `<a href="tg://user?id=${user.id}">${user.troll}</a>, ${user.distinction}. ${user.ups} votos\n`,
            "<b>Ban List</b>\n"
        );
        bot.sendMessage(id, txt, { parse_mode: "HTML" });
    },
    up: async (user: string, bot: TelegramBot, msg: TelegramBot.Message) => {
        const [troll] = await users().where("rankingName", "=", user.trim()).limit(1);
        const { id } = msg.chat;
        const voterName = `@${getUser(msg)?.username?.trim()}`;
        if (troll) {
            if (troll.rankingName !== voterName || voterName === "@g4rcez") {
                const voter = getUser(msg);
                await Votes.vote("UP", troll, `${voter?.id}`);
                bot.sendMessage(
                    id,
                    `<a href="tg://user?id=${voter?.id}">${voter?.username || voter?.first_name}</a> votou em ${user}`
                );
            } else {
                bot.sendMessage(id, `Você não pode votar em você, cabron`);
            }
        }
    },
    ban: async (user: string, bot: TelegramBot, msg: TelegramBot.Message) => {
        const [troll] = await users().where("rankingName", "=", user.trim()).limit(1);
        const { id } = msg.chat;
        if (troll) {
            const voter = getUser(msg);
            if (troll.rankingName !== "@g4rcez") {
                await Votes.vote("BAN", troll, `${voter?.id}`);
                bot.sendMessage(
                    id,
                    `<a href="tg://user?id=${voter?.id}">${voter?.username}</a> deu banVote em ${user}`,
                    {
                        parse_mode: "HTML"
                    }
                );
            } else {
                bot.sendMessage(id, "Não");
            }
        }
    },
    promote: async (user: string, bot: TelegramBot, msg: TelegramBot.Message) => {
        const [point, ...name] = user.trim().split(" ");
        const score = Number.parseInt(point, 10);
        const title = name.join(" ").substr(0, 80);
        if (!Number.isNaN(score)) {
            Users.updateRankByPoints(score, title);
            bot.sendMessage(msg.chat.id, `Promote all users with ${point} points to <b>${title}</b>`, {
                parse_mode: "HTML"
            });
            return;
        } else {
            Users.updateRankByName(`${point}`, title);
            bot.sendMessage(msg.chat.id, `Update ${point} to ${title}`);
        }
    }
};

type Commands = typeof CommandMap;

export default (bot: TelegramBot) => ({
    pattern: /^\/rank (add|list|ban|up|promote|banList)( @?\w+| \d\d? [@\w ]+| @\w+ [@\wçéáãõú ]+)?$/,
    command: async (msg: TelegramBot.Message, match: RegExpExecArray) => {
        const [, fn = "list", user]: [never, keyof Commands, string] = match as any;
        CommandMap[fn](`${user}`.trim(), bot, msg);
    }
});
