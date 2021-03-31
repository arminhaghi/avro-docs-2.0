export class StringExtentions {
    public static truncateWithEllipsis(baseString: string, maxLength: number): string {
        if (!baseString) {
            return "";
        }
        let str = baseString;

        if (str.length > maxLength) {
            str = `${str.substr(0, maxLength)}...`;
        }

        return str;
    }
}
