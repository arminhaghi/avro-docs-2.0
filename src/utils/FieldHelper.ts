import { ArrayType, AvroSchema, ComplexType, ComplexTypes, EnumType, MapType, NullType, RecordType, Type } from "../models/AvroSchema";
import { EnumData, RowData } from "../models/TableColumns";
import { AvroTypeHelper } from "./AvroTypeHelper";
import { CustomAvroParser } from "./CustomAvroParser";

export function FieldMapper(baseSchema: RecordType, currentSchema: RecordType, sourceItemName: string | undefined): RowData[] {
    const baseNamespace = currentSchema.namespace;
    const externalTypes: Map<string, Type> = new Map();
    CustomAvroParser.extractExternalTypes(baseSchema as RecordType, externalTypes, baseSchema.namespace);

    if (!currentSchema || !currentSchema.fields) {
        return [];
    }

    let children: RowData[] = [];

    const rows: RowData[] = currentSchema.fields.map((field, index) => {
        children = [];
        if (field && typeof field.type === "string") {
            // @ts-ignore
            if (field.type === currentSchema.name && !field.namespace) {
                // Circular Dependency. Intentionally leaving the type definition out.
            } else if (field.type.indexOf(".") > -1 && externalTypes.has(field.type)) {
                // @ts-ignore
                field.type = externalTypes.get(field.type);
            } else if (externalTypes.has(`${baseNamespace}.${field.type}`)) {
                // @ts-ignore
                field.type = externalTypes.get(`${baseNamespace}.${field.type}`);
            }
        } else if (field && AvroTypeHelper.isUnion(field.type as AvroSchema)) {
            const unionType = field.type as unknown as Type[];
            for (let index = 0; index < unionType.length; index++) {
                // @ts-ignore
                const type = field.type[index];
                if (typeof type === "string") {
                    // @ts-ignore
                    if (type === currentSchema.name && !type.namespace) {
                        // Circular Dependency. Intentionally leaving the type definition out.
                    } else if (type.indexOf(".") > -1 && externalTypes.has(type)) {
                        // @ts-ignore
                        field.type[index] = externalTypes.get(type);
                    } else if (externalTypes.has(`${baseNamespace}.${type}`)) {
                        // @ts-ignore
                        field.type[index] = externalTypes.get(`${baseNamespace}.${type}`);
                    }
                }
            }
        } else if (field && AvroTypeHelper.isArrayType(field.type as AvroSchema)) {
            // @ts-ignore
            const type = field.type.items;
            if (typeof type === "string") {
                // @ts-ignore
                if (type === currentSchema.name && !type.namespace) {
                    // Circular Dependency. Intentionally leaving the type definition out.
                } else if (type.indexOf(".") > -1 && externalTypes.has(type)) {
                    // @ts-ignore
                    field.type.items = externalTypes.get(type);
                } else if (externalTypes.has(`${baseNamespace}.${type}`)) {
                    // @ts-ignore
                    field.type.items = externalTypes.get(`${baseNamespace}.${type}`);
                }
            }
        } else if (field && AvroTypeHelper.isMapType(field.type as AvroSchema)) {
            // @ts-ignore
            const type = field.type.values;
            if (typeof type === "string") {
                // @ts-ignore
                if (type === currentSchema.name && !type.namespace) {
                    // Circular Dependency. Intentionally leaving the type definition out.
                } else if (type.indexOf(".") > -1 && externalTypes.has(type)) {
                    // @ts-ignore
                    field.type.values = externalTypes.get(type);
                } else if (externalTypes.has(`${baseNamespace}.${type}`)) {
                    // @ts-ignore
                    field.type.values = externalTypes.get(`${baseNamespace}.${type}`);
                }
            }
        }

        const complexType = field.type as ComplexType;

        if (complexType && complexType.type) {

            if (complexType.type === ComplexTypes.RECORD) {
                children = FieldMapper(baseSchema, complexType, sourceItemName);
            } else if (complexType.type === ComplexTypes.ARRAY) {
                const arrayType = (complexType as ArrayType).items;
                if (arrayType && (arrayType as ComplexType).type && (arrayType as ComplexType).type === ComplexTypes.RECORD) {
                    const currentFQN = `${currentSchema.namespace}${currentSchema.name}`;
                    const arrayTypeFQN = `${(arrayType as RecordType).namespace}${(arrayType as RecordType).name}`;
                    if (currentFQN !== arrayTypeFQN) {
                        children = FieldMapper(baseSchema, (arrayType as RecordType), sourceItemName);
                    }
                }
            } else if (complexType.type === ComplexTypes.MAP) {
                const mapType = (complexType as MapType).values;
                // @ts-ignore
                if (mapType && mapType.type && mapType.type === ComplexTypes.RECORD) {
                    children = FieldMapper(baseSchema, (mapType as RecordType), sourceItemName);
                }
            } else if (complexType.type === ComplexTypes.ENUM) {
                //do nothing since Render function is different and handles these
            }
        } else if (complexType) {
            if (AvroTypeHelper.isUnion(complexType)) {
                const unionComplexType = retrieveComplexTypeFromSimpleNullUnion(complexType);
                if (unionComplexType !== undefined) {
                    children = FieldMapper(baseSchema, (unionComplexType as RecordType), sourceItemName);
                }
            }
        }

        return {
            key: `${field.name}-${index}`,
            sourceItemName: sourceItemName ? sourceItemName : `${baseSchema.namespace}.${baseSchema.name}`,
            defaultNamespace: baseNamespace,
            name: field.name,
            type: field.type,
            defaultValue: field.default === undefined ? "" : JSON.stringify(field.default),
            doc: field.doc,
            children: children,
        };
    });

    return rows;
}

export function EnumMapper(schema: EnumType): EnumData[] {
    if (!schema || !schema.symbols) {
        return [];
    }

    const rows: EnumData[] = schema.symbols.map((symbol, index) => {
        return {
            key: `${symbol}-${index}`,
            option: {
                title: symbol,
                default: symbol === schema.default,
            },
        };
    });

    return rows;
}

function retrieveComplexTypeFromSimpleNullUnion(complexType: ComplexType): ComplexType | undefined {
    if (complexType instanceof Array && complexType.length === 2) {
        const nonNullIndex =  complexType[0] === NullType ? 1 : complexType[1] === NullType ? 0 : -1;
        if (nonNullIndex >= 0) {
            if (complexType[nonNullIndex].type === ComplexTypes.RECORD || complexType[nonNullIndex].type === ComplexTypes.ENUM) {
                return complexType[nonNullIndex];
            } else if (complexType[nonNullIndex].type === ComplexTypes.MAP) {
                const mapType = (complexType[nonNullIndex] as MapType).values;
                // @ts-ignore
                if (mapType && mapType.type && mapType.type === ComplexTypes.RECORD) {
                    // @ts-ignore
                    return mapType as ComplexType;
                }
            }
        }
    }
    return undefined;
}
