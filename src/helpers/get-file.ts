import { readFileSync } from "fs";

export default (file: string, parse: boolean = true) =>
    parse
        ? JSON.parse(readFileSync(file, { encoding: "utf-8" }))
        : readFileSync(file, { encoding: "utf-8" });
