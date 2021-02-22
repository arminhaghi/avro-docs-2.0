import * as AVRO from "avsc";

export class AvroParser {

    public static GetAllRecords(schema: any, records: Map<string, AVRO.Schema>): void {
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
        } else if (schema.type.branchName === "array") {
            if (!records.has(schema.type.itemsType.branchName)) {
                records.set(schema.type.itemsType.branchName, schema.type.itemsType);

                if (schema.type.itemsType.fields && schema.type.itemsType.fields.length) {
                    schema.type.itemsType.fields.forEach(field => {
                        AvroParser.GetAllRecords(field, records);
                    });
                }

            }
        } else if (AVRO.Type.isType(schema, "MapType")) {
            console.log("MapType");
            records.set("MapType", schema);
        } else if (AVRO.Type.isType(schema, "EnumType")) {
            console.log("EnumType");
            records.set("EnumType", schema);
        } else if (AVRO.Type.isType(schema, "FixedType")) {
            console.log("FixedType");
            records.set("FixedType", schema);
        } else if (AVRO.Type.isType(schema, "LogicalType")) {
            console.log("LogicalType");
            records.set("LogicalType", schema);
        } else if (AVRO.Type.isType(schema, "UnwrappedUnionType")) {
            console.log("UnwrappedUnionType");
            records.set("UnwrappedUnionType", schema);
        } else if (AVRO.Type.isType(schema, "WrappedUnionType")) {
            console.log("WrappedUnionType");
            records.set("WrappedUnionType", schema);
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
