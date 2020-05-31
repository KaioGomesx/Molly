import knex from "knex";
import TelegramBot from "node-telegram-bot-api";
import { join } from "path";

const connect = knex({
    client: "sqlite3",
    useNullAsDefault: false,
    connection: {
        filename: join(process.cwd(), "db", "dev.sqlite")
    }
});

export type Users = {
    id: string;
    rankingName: string;
    trollLevel: string;
};

export type Votes = {
    candidate: string;
    id: string;
    timeVote: number;
    vote: "UP" | "BAN";
    voter: string;
};

export type UserVotes = Users & Votes;

export type Competitor = {
    bans: number;
    ups: number;
    troll: string;
    distinction: string;
    id: string;
};

export type Competitors = {
    [key: string]: Competitor;
};

export const users = () => connect.table<Users>("users");
export const votes = () => connect.table<Votes>("votes");
export const userVotes = () => connect.table<Users>("users").join<Votes>("votes", "users.id", "=", "votes.candidate");

export const Users = {
    save: async (user: string, msg: TelegramBot.Message) => {
        try {
            await users().insert({
                id: `${msg.reply_to_message?.from?.id}`,
                rankingName: user,
                trollLevel: ""
            });
            return true;
        } catch (error) {
            return false;
        }
    },
    getAll: async () => users().select()
};

export const Votes = {
    vote: async (vote: Votes["vote"], troll: Required<Users>, voter: string | number) => {
        try {
            const now = Date.now();
            await votes().insert({
                id: `${now}`,
                voter: `${voter}`,
                candidate: troll.id,
                timeVote: now,
                vote
            });
            return true;
        } catch (error) {
            return false;
        }
    }
};

const countUsers = (acc: Competitors, el: UserVotes) => {
    const isBan = el.vote === "BAN" ? true : false;
    if (el.candidate in acc) {
        const prev = acc[el.candidate];
        acc[el.candidate] = {
            ...prev,
            bans: isBan ? prev.bans + 1 : prev.bans,
            ups: isBan ? prev.ups + 1 : prev.ups
        };
    }
    acc[el.candidate] = {
        bans: isBan ? 1 : 0,
        ups: isBan ? 0 : 1,
        id: el.id,
        distinction: el.trollLevel || "Unranked",
        troll: el.rankingName
    };
    return acc;
};

export const UserVotes = {
    trollVotes: async (idOrNick: string) => {
        const list = await userVotes().where("candidate", "=", idOrNick);
        return list.reduce(countUsers, {} as Competitors);
    },
    allVotes: async () => {
        const list = await userVotes();
        return list.reduce(countUsers, {} as Competitors);
    }
};
