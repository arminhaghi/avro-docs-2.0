// import * as fs from "fs";
import fs from "fs";
import path from "path";
import { NamedType } from "../src/models/AvroSchema";
import { CustomAvroParser } from "../src/utils/CustomAvroParser";
import { FileReader } from "../src/utils/FileReader";
import { MapHelper } from "../src/utils/MapHelper";

const files: string[] = [];
const schemaArray: NamedType[] = [];

function FindAllFilesInDirectory(directory) {
    fs.readdirSync(directory).forEach(file => {
        const absolute = path.join(directory, file);
        if (fs.statSync(absolute).isDirectory()) {
            return FindAllFilesInDirectory(absolute);
        } else {
            return files.push(absolute);
        }
    });
}

function SaveFile(path, content) {
    content = JSON.stringify(content);
    fs.writeFileSync(path, content);
}

async function readAndSaveSchemas() {
    const namespaceTree = new Map<string, string[]>();
    for (let i = 0; i < files.length; i++) {
        const schema = await FileReader.read(files[i]);
        const namedType = CustomAvroParser.getNamedTypes(schema.content);
        schemaArray.push({
            name: namedType.name,
            namespace: namedType.namespace || "undefined",
            type: namedType.type,
            doc: namedType.doc || "",
            aliases: [],
        });

        const children = namespaceTree.get(namedType.namespace) || [];
        children.push(namedType.name);
        namespaceTree.set(namedType.namespace, children);
    }

    console.log(`Total ${schemaArray.length} schemas processed`);
    SaveFile("./src/all-schemas-summary.json", schemaArray);
    SaveFile("./src/namespace-tree.json", MapHelper.mapToJsonObject(namespaceTree));
}


FindAllFilesInDirectory("./public/avro/");
readAndSaveSchemas();
