import { TagData } from "../components/DataType";
import { ComplexType, ComplexTypes, LogicalType, NamedType, NullType, PrimitiveTypes, Type } from "../models/AvroSchema";
import { RowData } from "../models/FieldsColumn";
import { StringExtentions } from "./StringExtentions";

export class TypeHelper {

    public static formatTag(type: Type, record: RowData): TagData {
        switch (type) {
        case NullType:
            return {
                text: type.toUpperCase(),
                tooltip: "no value",
            };
        case PrimitiveTypes.BOOLEAN:
            return {
                text: type.toUpperCase(),
                tooltip: "a binary value",
            };
        case PrimitiveTypes.INT:
            return {
                text: type.toUpperCase(),
                tooltip: "32-bit signed integer",
            };
        case PrimitiveTypes.LONG:
            return {
                text: type.toUpperCase(),
                tooltip: "64-bit signed integer",
            };
        case PrimitiveTypes.FLOAT:
            return {
                text: type.toUpperCase(),
                tooltip: "single precision (32-bit) IEEE 754 floating-point number",
            };
        case PrimitiveTypes.DOUBLE:
            return {
                text: type.toUpperCase(),
                tooltip: "double precision (64-bit) IEEE 754 floating-point number",
            };
        case PrimitiveTypes.BYTES:
            return {
                text: type.toUpperCase(),
                tooltip: "sequence of 8-bit unsigned bytes",
            };
        case PrimitiveTypes.STRING:
            return {
                text: type.toUpperCase(),
                tooltip: "unicode character sequence",
            };
        }

        const namedType = type as NamedType;
        const complexType = type as ComplexType;

        switch (namedType.type) {
        case ComplexTypes.FIXED:
        case ComplexTypes.RECORD:
        case ComplexTypes.ENUM:
            return {
                text: namedType.name,
                tooltip: StringExtentions.truncateWithEllipsis(namedType.doc, 500),
                path: namedType.namespace && namedType.namespace.length ? `${namedType.namespace}.${namedType.name}` : `${record.defaultNamespace}.${namedType.name}`,
            };
        }

        if (complexType.type === ComplexTypes.ARRAY) {
            const arrayType = TypeHelper.formatTag(complexType.items, record);
            return {
                text: arrayType.text,
                tooltip: arrayType.tooltip,
                path: arrayType.path,
            };
        } else if (complexType.type === ComplexTypes.MAP) {
            return {
                text: complexType.type.toUpperCase(),
                tooltip: "",
                path: "",
            };
        } else if ((complexType as unknown as LogicalType).logicalType && (complexType as unknown as LogicalType).logicalType.length) {
            return {
                text: (complexType as unknown as LogicalType).logicalType,
                tooltip: "Logical Type",
                path: "",
            };
        }

        // Workaround for reused types. This will print the type but without a link
        if (typeof type === "string") {
            return {
                text: type,
                tooltip: "",
                path: "",
            };
        }

        return {
            text: "TYPE IS UNKNOWN",
            tooltip: "",
            path: "",
        };
    }
}
