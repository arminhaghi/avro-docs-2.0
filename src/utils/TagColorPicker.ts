import * as AVRO from "avsc";

const NullType = "null";

enum PrimitiveTypes {
    BOOLEAN = "boolean",
    INT = "int",
    LONG = "long",
    FLOAT = "float",
    DOUBLE = "double",
    BYTES = "bytes",
    STRING = "string",
}

enum ComplexType {
    ARRAY = "array",
    ENUM = "enum",
    FIXED = "fixed",
    MAP = "map",
    RECORD = "record",
    UNION = "union",
}

export class TagColorPicker {

    public static pick(type: string): string {
        switch (type) {
        case NullType:
            return "red";
        case PrimitiveTypes.BOOLEAN:
        case PrimitiveTypes.BYTES:
        case PrimitiveTypes.DOUBLE:
        case PrimitiveTypes.FLOAT:
        case PrimitiveTypes.INT:
        case PrimitiveTypes.LONG:
        case PrimitiveTypes.STRING:
            return "blue";
        case ComplexType.UNION:
            return "orange";
        case ComplexType.RECORD:
            return "geekblue";
        case ComplexType.ENUM:
            return "purple";
        case ComplexType.ARRAY:
            return "green";
        case "magenta":
        case "volcano":
        case "lime":
        case "cyan":
        case "gold":
        default:
            return "grey";
        }
    }
}
