export class TagColorPicker {

    public static pick(type: string): string {
        switch (type) {
        case "record":
            return "geekblue";
        case "enum":
            return "gold";
        case "array":
            return "green";
        case "magenta":
        case "red":
        case "volcano":
        case "orange":
        case "gold":
        case "lime":
        case "cyan":
        case "blue":
        case "purple":
        default:
            return "grey";
        }
    }
}
