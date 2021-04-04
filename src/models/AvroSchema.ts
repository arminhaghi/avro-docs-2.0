export type ComplexType = RecordType | EnumType | ArrayType | MapType | UnionType | FixedType;
export type PrimitiveType = null | boolean | number | string | Record<string, unknown> | unknown[];
export type Type = ComplexType | PrimitiveType;

export type FieldDefaultValueType = string | number | null | boolean | Record<string, unknown> | any[];

export const NullType = "null";
export enum PrimitiveTypes {
    BOOLEAN = "boolean",
    INT = "int",
    LONG = "long",
    FLOAT = "float",
    DOUBLE = "double",
    BYTES = "bytes",
    STRING = "string",
}

export enum ComplexTypes {
    ARRAY = "array",
    ENUM = "enum",
    FIXED = "fixed",
    MAP = "map",
    RECORD = "record",
    UNION = "union",
}

export type TypeNames = ComplexTypes | string;
export interface AvroSchema {
    type: TypeNames;
}

export interface NamedType extends AvroSchema {
    name: string;
    namespace: string;
    aliases: string[];
    doc: string;
}

export interface SimpleNamedType extends NamedType {
    type: string;
}

export interface Field {
    name: string;
    doc: string;
    type: Type;
    aliases: string[];
    default: FieldDefaultValueType;
}

export interface RecordType extends NamedType {
    type: ComplexTypes.RECORD;
    fields: Field[];
}

export interface EnumType extends NamedType {
    type: ComplexTypes.ENUM;
    symbols: string[];
    default: string;
}

export interface FixedType extends NamedType {
    type: ComplexTypes.FIXED;
    size: number;
}

export interface UnionType extends AvroSchema {
    type: ComplexTypes.UNION;
    types: Type[];
}

export interface ArrayType extends AvroSchema {
    type: ComplexTypes.ARRAY;
    items: Type;
}

export interface MapType extends AvroSchema {
    type: ComplexTypes.MAP;
    values: Type;
}

export interface LogicalType extends AvroSchema {
    type: string;
    logicalType: string;
}
