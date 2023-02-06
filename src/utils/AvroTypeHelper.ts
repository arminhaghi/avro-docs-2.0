import {
    ArrayType,
    AvroSchema,
    ComplexType,
    EnumType,
    LogicalType,
    MapType,
    RecordType,
    NamedType,
} from "../models/AvroSchema";

export class AvroTypeHelper {

    public static isRecordType(schema: AvroSchema): schema is RecordType {
        if (typeof schema === "string" || schema instanceof Array) {
            return false;
        }
        return schema.type === "record";
    }

    public static isArrayType(schema: AvroSchema): schema is ArrayType {
        if (typeof schema === "string" || schema instanceof Array) {
            return false;
        }
        return schema.type === "array";
    }

    public static isMapType(schema: AvroSchema): schema is MapType {
        if (typeof schema === "string" || schema instanceof Array) {
            return false;
        }

        return schema.type === "map";
    }

    public static isEnumType(schema: NamedType | AvroSchema): schema is EnumType {
        return schema.type === "enum";
    }

    public static isUnion(schema: AvroSchema): schema is ComplexType {
        return schema instanceof Array;
    }

    public static isLogicalType(schema: AvroSchema): schema is LogicalType {
        if (typeof schema === "string" || schema instanceof Array) {
            return false;
        }
        return "logicalType" in schema;
    }

    public static isFixedType(schema: AvroSchema): schema is ComplexType {
        return schema.type === "fixed";
    }

}
