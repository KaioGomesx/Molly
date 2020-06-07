import { createWriteStream, unlinkSync } from "fs";
import TelegramBot from "node-telegram-bot-api";
import ytdl from "ytdl-core";

export default (bot: TelegramBot) => ({
    pattern: /^\/(yt|ytconvert) https:\/\/(www.)?youtube\.com\/watch\?v=\w+$/,
    command: async (msg: TelegramBot.Message, [, link]: RegExpMatchArray) => {
        const {
            message_id,
            chat: { id }
        } = msg;
        const songInfo = await ytdl.getInfo(link);
        const { video_id, title } = songInfo;
        const fileStream = createWriteStream(`${video_id}.mp3`);
        const filename = fileStream.path;
        const stream = ytdl.downloadFromInfo(songInfo, { filter: "audioonly" });
        const replyMsgOption = {
            reply_to_message_id: message_id,
            parse_mode: "Markdown" as const
        };
        stream.pipe(fileStream);
        bot.sendMessage(id, `\`${title}\` foi adicionado a lista de downloads...Aguarde\n`, replyMsgOption).then(() => {
            stream.on("end", () => {
                (bot.sendAudio as Function)(id, filename, replyMsgOption, {
                    filename: `${title}.mp3`,
                    contentType: "audio/mpeg"
                });
                unlinkSync(filename);
            });
        });
    }
});
