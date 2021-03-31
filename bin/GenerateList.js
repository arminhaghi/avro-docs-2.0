/* eslint-disable */
const fs = require("fs");
const path = require("path");

const files = [];

function FindAllFilesInDirectory(directory) {
    fs.readdirSync(directory).forEach(file => {
        const absolute = path.join(directory, file);
        if (fs.statSync(absolute).isDirectory()) {
            return FindAllFilesInDirectory(absolute);
        } else {
            return files.push(absolute.replace("public\\", ""));
        }
    });
}

function SaveFile(path, content) {
    content = JSON.stringify(content);
    fs.writeFileSync(path, content);
}


FindAllFilesInDirectory("./public/avro/");
SaveFile("./src/avro-file-list.json", files);
