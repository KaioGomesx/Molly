const normalizer = require("../helpers/normalizer");
const getFile = require("../helpers/get-file");

export class Document {
    public messageId: string;
    public date: string;
    public name: string;
    public mime_type: string;
    public fileId: string;
    public size: number;
    public words: string[];

    constructor(arg: any) {
        this.messageId = arg.message_id;
        this.date = arg.date;
        this.name = arg.document.file_name;
        this.mime_type = arg.document.mime_type;
        this.fileId = arg.document.file_id;
        this.size = arg.document.file_size;
        this.words = getFile("./data/words.json");
    }

    get filename() {
        let name = `${this.name}`;
        name.split(" ").forEach((word) => {
            const transform = normalizer(word);
            if (this.words.includes(transform)) {
                name += ` #${word}`;
            }
        });
        return name;
    }
}
