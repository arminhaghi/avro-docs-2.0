import * as fs from "fs";
import path from "path";
import { CustomAvroParser } from "../src/utils/CustomAvroParser";
import { FileReader } from "../src/utils/FileReader";
import { MapHelper } from "../src/utils/MapHelper";

const files: string[] = [];

function FindAllFilesInDirectory(directory) {
    fs.readdirSync(directory).forEach(file => {
        const absolute = path.join(directory, file);
        if (fs.statSync(absolute).isDirectory()) {
            return FindAllFilesInDirectory(absolute);
        } else if (file.endsWith(".avsc")) {
            return files.push(absolute);
        }
    });
}

function SaveFile(path, content) {
    content = JSON.stringify(content);
    fs.writeFileSync(path, content, { flag: "w" });
}

async function readAndSaveSchemas() {
    const namespaceTree = new Map<string, string[]>();
    for (let i = 0; i < files.length; i++) {
        const schema = await FileReader.read(files[i]);
        console.log(`Processing ${files[i]}`);
        const namedType = CustomAvroParser.getNamedTypes(schema.content);

        const children = namespaceTree.get(namedType.namespace) || [];
        children.push(namedType.name);
        namespaceTree.set(namedType.namespace, children);
    }

    console.log("Processing Finished!");
    SaveFile("./src/namespace-tree.json", MapHelper.mapToJsonObject(namespaceTree));
}


FindAllFilesInDirectory("./public/avro/");
readAndSaveSchemas();
