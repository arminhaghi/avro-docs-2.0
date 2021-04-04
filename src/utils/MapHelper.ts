export class MapHelper {

    public static mapToJsonObject(map: Map<string, unknown>): Record<string, unknown> {
        const jsonObject = {};
        map.forEach((value, key) => {
            jsonObject[key] = value;
        });

        return jsonObject;
    }

    public static jsonToMap(jsonObject: Record<string, unknown>): Map<string, unknown> {
        const map = new Map<string, unknown>();
        for (const value in jsonObject) {
            map.set(value, jsonObject[value]);
        }

        return map;
    }
}
