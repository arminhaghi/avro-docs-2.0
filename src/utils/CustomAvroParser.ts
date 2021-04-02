import { Type, RecordType, NamedType, ComplexType, MapType, AvroSchema } from "../models/AvroSchema";
import { AvroTypeHelper } from "./AvroTypeHelper";

export class CustomAvroParser {

    public static getNamedTypes(schemaContent: string): NamedType {
        const schema: NamedType = JSON.parse(schemaContent);
        return schema;
    }

    public static extractExternalTypes(schema: ComplexType, outMap: Map<string, Type>, parentNamespace: string): void {
        if (!schema) {
            return;
        }

        if (AvroTypeHelper.isRecordType(schema) && schema.fields) {
            if (outMap.has(`${schema.namespace || parentNamespace}.${schema.name}`)) { // circular dependency
                return;
            }

            CustomAvroParser.addNamespaceIfNeeded(schema, parentNamespace);
            outMap.set(`${schema.namespace}.${schema.name}`, schema);
            schema.fields.map(field => {
                if (field.type && typeof field.type !== "string") {
                    const complexType = field.type as AvroSchema;
                    if (AvroTypeHelper.isRecordType(complexType)) {
                        CustomAvroParser.addNamespaceIfNeeded(complexType, parentNamespace);
                        CustomAvroParser.extractExternalTypes(complexType, outMap, complexType.namespace);
                    } else if (AvroTypeHelper.isEnumType(complexType)) {
                        CustomAvroParser.addNamespaceIfNeeded(complexType, parentNamespace);
                        outMap.set(`${complexType.namespace}.${complexType.name}`, complexType);
                    } else if (AvroTypeHelper.isArrayType(complexType) && typeof complexType.items !== "string") {
                        const arrayType = complexType.items as NamedType;
                        CustomAvroParser.addNamespaceIfNeeded(arrayType, parentNamespace);
                        CustomAvroParser.extractExternalTypes(complexType.items as RecordType, outMap, arrayType.namespace);
                    } else if (AvroTypeHelper.isUnion(complexType)) {
                        const unionType = complexType as unknown as Type[];
                        for (let i = 0; i < unionType.length; i++) {
                            if (typeof unionType[i] !== "string") {
                                const childUnionType = unionType[i] as NamedType;
                                CustomAvroParser.addNamespaceIfNeeded(childUnionType, parentNamespace);
                                CustomAvroParser.extractExternalTypes(childUnionType as RecordType, outMap, childUnionType.namespace);
                            }
                        }
                    } else if (AvroTypeHelper.isMapType(complexType) && typeof complexType.values !== "string") {
                        const mapType = complexType as MapType;
                        // @ts-ignore
                        if (mapType.values && mapType.values.name) {
                            // @ts-ignore
                            CustomAvroParser.addNamespaceIfNeeded(mapType.values, parentNamespace);
                        }
                        CustomAvroParser.extractExternalTypes(mapType.values as ComplexType, outMap, parentNamespace);
                    }
                }
            });
        } else if (AvroTypeHelper.isEnumType(schema)) {
            CustomAvroParser.addNamespaceIfNeeded(schema, parentNamespace);
            outMap.set(`${schema.namespace}.${schema.name}`, schema);
        }
    }

    // If namespace is the same, avro omits it, we duplicate it becuase we need it :-D
    public static addNamespaceIfNeeded(type: NamedType, defaultNamespace: string): void {
        if (!type.namespace || !type.namespace.length) {
            type.namespace = defaultNamespace;
        }
    }
}
