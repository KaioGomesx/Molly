import knex from "knex";
import Linq from "linq-arrays";
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

export type Competitors = { [key: string]: Competitor };

export const users = () => connect.table<Users>("users");
export const votes = () => connect.table<Votes>("votes");
export const userUpVotes = () =>
    connect.table<Users>("users").join<Votes>("votes", "users.id", "=", "votes.candidate").where("vote", "=", "UP");
export const userBanVotes = () =>
    connect.table<Users>("users").join<Votes>("votes", "users.id", "=", "votes.candidate").where("vote", "=", "BAN");

type UserVote = {
    id: string;
    rankingName: string;
    trollLevel: string;
    vote: number;
};

export const Users = {
    save: async (user: string, msg: TelegramBot.Message) => {
        try {
            await users().insert({
                id: `${msg.reply_to_message?.from?.id}`,
                rankingName: user.trim(),
                trollLevel: ""
            });
            return true;
        } catch (error) {
            return false;
        }
    },
    updateRankByPoints: async (limit: number, trollLevel: string) => {
        const list: UserVote[] = await userUpVotes().where("vote", "=", "UP").select(["users.*", "votes.id as vote"]);
        const group = list.reduce((acc, el) => {
            if (el.rankingName in acc) {
                const x = acc[el.rankingName];
                el.trollLevel = trollLevel;
                return { ...acc, [el.rankingName]: [...x, el] };
            }
            return { ...acc, [el.rankingName]: [el] };
        }, {} as any);
        Object.values(group).forEach(async (x: any) => {
            const list: any[] = x;
            if (list.length >= limit) {
                list.map(async (user) => {
                    await users().where("id", "=", user.id).update({
                        id: user.id,
                        rankingName: user.rankingName,
                        trollLevel: trollLevel
                    });
                });
            }
        });
    },
    updateRankByName: async (name: string, trollLevel: string) => {
        const list: UserVote[] = await userUpVotes()
            .where("vote", "=", "UP")
            .where("rankingName", "=", name)
            .select(["users.*", "votes.id as vote"]);
        const group = list.reduce((acc, el) => {
            if (el.rankingName in acc) {
                const x = acc[el.rankingName];
                el.trollLevel = trollLevel;
                return { ...acc, [el.rankingName]: [...x, el] };
            }
            return { ...acc, [el.rankingName]: [el] };
        }, {} as any);
        Object.values(group).forEach(async (x: any) => {
            const list: any[] = x;
            list.map(async (user) => {
                await users().where("id", "=", user.id).update({
                    id: user.id,
                    rankingName: user.rankingName,
                    trollLevel: trollLevel
                });
            });
        });
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
        return {
            ...acc,
            [el.candidate]: {
                ...prev,
                bans: isBan ? prev.bans + 1 : prev.bans,
                ups: isBan ? prev.ups + 1 : prev.ups
            }
        };
    }
    return {
        ...acc,
        [el.candidate]: {
            bans: isBan ? 1 : 0,
            ups: isBan ? 0 : 1,
            id: el.id,
            distinction: el.trollLevel || "Unranked",
            troll: el.rankingName
        }
    };
};

type UserVoteType = {
    id: string;
    rankingName: string;
    trollLevel: string;
    vote: string;
    voter: string;
    candidate: string;
    timeVote: number;
    votes: number;
};

export const UserVotes = {
    trollVotes: async (idOrNick: string) => {
        const list = await userUpVotes().where("candidate", "=", idOrNick);
        return list.reduce(countUsers, {} as Competitors);
    },
    allVotes: async (): Promise<Competitor[]> => {
        // "SELECT distinct *, COUNT(candidate) FROM users JOIN votes ON users.id = votes.candidate group by candidate order by candidate;"
        const list: UserVoteType[] = (await userUpVotes()
            .count("candidate as voteCount")
            .orderBy("voteCount", "desc")
            .groupBy("candidate")
            .select("*")) as any;
        return list.map((el) => ({
            bans: 0,
            distinction: el.trollLevel,
            id: el.candidate,
            troll: el.rankingName,
            ups: (el as any).voteCount
        }));
    },
    allBans: async (): Promise<Competitor[]> => {
        // "SELECT distinct *, COUNT(candidate) FROM users JOIN votes ON users.id = votes.candidate group by candidate order by candidate;"
        const list: UserVoteType[] = (await userBanVotes()
            .count("candidate as voteCount")
            .orderBy("voteCount", "desc")
            .groupBy("candidate")
            .select("*")) as any;
        return list.map((el) => ({
            bans: 0,
            distinction: el.trollLevel,
            id: el.candidate,
            troll: el.rankingName,
            ups: (el as any).voteCount
        }));
    }
};
