import * as AVRO from "avsc";

export class AvroParser {

    public static GetAllRecords(schema: any, records: Map<string, AVRO.Schema>): void {
        if (!schema) {
            return;
        }
        if (schema.branchName === "") {
            schema.branchName = "UNKNOWN";
        }
        if (AVRO.Type.isType(schema, "record")) {
            if (!records.has(schema.branchName)) {
                records.set(schema.branchName, schema);

                if (schema.fields && schema.fields.length) {
                    schema.fields.forEach(field => {
                        AvroParser.GetAllRecords(field, records);
                    });
                }
            }
        } else if (schema.type && schema.type.branchName === "array") {
            if (!records.has(schema.type.itemsType.branchName)) {
                records.set(schema.type.itemsType.branchName, schema.type.itemsType);

                if (schema.type.itemsType.fields && schema.type.itemsType.fields.length) {
                    schema.type.itemsType.fields.forEach(field => {
                        AvroParser.GetAllRecords(field, records);
                    });
                }

            }
        } else if (AVRO.Type.isType(schema, "enum")) {
            if (!records.has(schema.branchName)) {
                records.set(schema.branchName, schema);
            }
        } else if (AVRO.Type.isType(schema.type, "record")) {
            AvroParser.GetAllRecords(schema.type, records);
        } else if (AVRO.Type.isType(schema.type, "MapType")) {
            console.log("MapType");
            records.set("MapType", schema);
        } else if (AVRO.Type.isType(schema.type, "enum")) {
            // console.log("EnumType");
            // records.set("EnumType", schema.type);
            AvroParser.GetAllRecords(schema.type, records);
        } else if (AVRO.Type.isType(schema.type, "fixed")) {
            console.log("FixedType");
            records.set("FixedType", schema.type);
        } else if (AVRO.Type.isType(schema.type, "logical")) {
            console.log("LogicalType");
            records.set("LogicalType", schema.type);
        } else if (AVRO.Type.isType(schema.type, "union")) {
            // records.set("UnionType", schema.type);
            console.log("UnionType", schema.type);
            for (let i = 0; i < schema.type.types.length; i++) {
                AvroParser.GetAllRecords(schema.type.types[i], records);
            }
        } else if (AVRO.Type.isType(schema.type, "union:unwrapped")) {
            // records.set("UnwrappedUnionType", schema.type);
            console.log("UnwrappedUnionType");
            AvroParser.GetAllRecords(schema.type, records);
        } else if (AVRO.Type.isType(schema.type, "union:wrapped")) {
            // records.set("WrappedUnionType", schema.type);
            console.log("WrappedUnionType");
            AvroParser.GetAllRecords(schema.type, records);
        } else {
            // console.log("typeName", schema.typeName);
            // console.log("type", schema.type);
        }

        // // Means it's an array
        // if (schema.itemTypes) {
        //     //
        // }

        // // Means it's an enum
        // if (schema.symbols) {
        //     //
        // }

        // // Means it's a fixed type
        // if (schema.schema) {
        //     //
        // }

    }
}
