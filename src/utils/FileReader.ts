import { promises as fs } from "fs";
import path from "path";

export class FileReader {

    public static async read(filename: string): Promise<any> {
        const postsDirectory = path.join(process.cwd(), "avro");
        const filePath = path.join(postsDirectory, filename);
        const fileContents = await fs.readFile(filePath, "utf8");

        return {
            filename,
            content: fileContents,
        };
    }
}
