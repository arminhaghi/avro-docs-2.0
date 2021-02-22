import * as AVRO from "avsc";
import { TagData } from "../components/DataType";

export type ComplexType =
    AVRO.types.ArrayType |
    AVRO.types.BooleanType |
    AVRO.types.BytesType |
    AVRO.types.DoubleType |
    AVRO.types.EnumType |
    AVRO.types.FixedType |
    AVRO.types.FixedType |
    AVRO.types.FloatType |
    AVRO.types.IntType |
    AVRO.types.LogicalType |
    AVRO.types.LongType |
    AVRO.types.MapType |
    AVRO.types.NullType |
    AVRO.types.RecordType |
    AVRO.types.StringType |
    AVRO.types.UnwrappedUnionType |
    AVRO.types.WrappedUnionType;

export class TypeHelper {

    public static formatTag(type: string, name: string, doc = ""): TagData {
        const formattedName = name.substring(name.lastIndexOf(".") + 1);

        switch (type) {
        case "null":
            return {
                text: formattedName.toUpperCase(),
                tooltip: "no value",
            };
        case "boolean":
            return {
                text: formattedName.toUpperCase(),
                tooltip: "a binary value",
            };
        case "int":
            return {
                text: formattedName.toUpperCase(),
                tooltip: "32-bit signed integer",
            };
        case "long":
            return {
                text: formattedName.toUpperCase(),
                tooltip: "64-bit signed integer",
            };
        case "float":
            return {
                text: formattedName.toUpperCase(),
                tooltip: "single precision (32-bit) IEEE 754 floating-point number",
            };
        case "double":
            return {
                text: formattedName.toUpperCase(),
                tooltip: "double precision (64-bit) IEEE 754 floating-point number",
            };
        case "bytes":
            return {
                text: formattedName.toUpperCase(),
                tooltip: "sequence of 8-bit unsigned bytes",
            };
        case "string":
            return {
                text: formattedName.toUpperCase(),
                tooltip: "unicode character sequence",
            };
        case "record":
        case "enum":
        default:
            return {
                text: formattedName,
                tooltip: doc,
                path: name,
            };
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static formatDefaultValue(defaultValue: any): string {
        if (defaultValue === undefined) {
            return "";
        } else if (defaultValue === null) {
            return "NULL";
        }
        return defaultValue.toString();
    }
}
