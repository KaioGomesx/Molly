import { getReply } from "../chat";
import { Command } from "../global";

const exec: Command = (bot) => ({
    pattern: /^\/(bonit(o|[aã]o))( @\w+)?$/,
    command: (msg, match) => {
        const nick = match![3] || "";
        const { id } = msg.chat;
        const replyUser = (getReply(msg)?.username || nick).replace(/^@/g, "").trim();
        const text = `@${replyUser} está bonitão hoje`.replace(/@+/, "@");
        bot.sendMessage(id, text);
        bot.deleteMessage(id, `${msg.message_id}`);
    }
});

export default exec;
