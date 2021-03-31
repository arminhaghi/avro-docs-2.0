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

            const schemaWithoutFields = { ...schema, fields: [] };

            outMap.set(`${schema.namespace || parentNamespace}.${schema.name}`, schemaWithoutFields);
            schema.fields.map(field => {
                if (field.type && typeof field.type !== "string") {
                    const complexType = field.type as AvroSchema;
                    if (AvroTypeHelper.isRecordType(complexType)) {
                        CustomAvroParser.extractExternalTypes(complexType, outMap, complexType.namespace || parentNamespace);
                    } else if (AvroTypeHelper.isEnumType(complexType)) {
                        outMap.set(`${complexType.namespace || parentNamespace}.${complexType.name}`, complexType);
                    } else if (AvroTypeHelper.isArrayType(complexType) && typeof complexType.items !== "string") {
                        const arrayType = complexType.items as NamedType;
                        CustomAvroParser.extractExternalTypes(complexType.items as RecordType, outMap, arrayType.namespace || parentNamespace);
                    } else if (AvroTypeHelper.isUnion(complexType)) {
                        const unionType = complexType as unknown as Type[];
                        for (let i = 0; i < unionType.length; i++) {
                            if (typeof unionType[i] !== "string") {
                                const childUnionType = unionType[i] as NamedType;
                                CustomAvroParser.extractExternalTypes(childUnionType as RecordType, outMap, childUnionType.namespace || parentNamespace);
                            }
                        }
                    } else if (AvroTypeHelper.isMapType(complexType) && typeof complexType.values !== "string") {
                        const mapType = complexType as MapType;
                        CustomAvroParser.extractExternalTypes(mapType.values as ComplexType, outMap, parentNamespace);
                    }
                }
            });
        } else if (AvroTypeHelper.isEnumType(schema)) {
            outMap.set(`${schema.namespace || parentNamespace}.${schema.name}`, schema);
        }
    }
}
