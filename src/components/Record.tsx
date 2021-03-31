import { PageHeader, Table, Tag } from "antd";
import React from "react";
import ReactMarkdown from "react-markdown";
import { AvroSchema, ComplexTypes, NamedType, RecordType, Type } from "../models/AvroSchema";
import { RowData, FieldColumns } from "../models/FieldsColumn";
import { AvroTypeHelper } from "../utils/AvroTypeHelper";
import { CustomAvroParser } from "../utils/CustomAvroParser";
import { TagColorPicker } from "../utils/TagColorPicker";

interface PropsType {
    schema: NamedType;
}

const Record = (props: PropsType): JSX.Element => {
    // If a custom type appears more than once in the schema, only the first appearance of it will have all the details.
    const externalTypes: Map<string, Type> = new Map();
    const schema = props.schema as RecordType;
    const baseNamespace = schema.namespace;
    CustomAvroParser.extractExternalTypes(schema, externalTypes, baseNamespace);

    const rows: RowData[] = schema.fields.map(field => {
        if (field && typeof field.type === "string") {
            // @ts-ignore
            if (field.type === schema.name && !field.namespace) {
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
                    if (type === schema.name && !type.namespace) {
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
        }

        // @ts-ignore
        if (typeof field.type !== "string") {
            if (AvroTypeHelper.isRecordType(field.type as AvroSchema)) {
                // @ts-ignore
                field.type = { ...field.type, doc: "", fields: [] };
            } else if (AvroTypeHelper.isEnumType(field.type as AvroSchema)) {
                // @ts-ignore
                field.type = { ...field.type, doc: "", symbols: [] };
            } else if (AvroTypeHelper.isArrayType(field.type as AvroSchema)) {
                // @ts-ignore
                field.items = { ...field.items, doc: "", fields: [], symbols: [] };
            }
        }

        return {
            defaultNamespace: baseNamespace,
            name: field.name,
            type: field.type,
            defaultValue: field.default === undefined ? "" : JSON.stringify(field.default),
            doc: field.doc,
        };
    });

    let i = 0;

    return (
        <>
            <PageHeader
                title={schema.name}
                tags={<Tag color={TagColorPicker.pick(ComplexTypes.RECORD)}>{ComplexTypes.RECORD.toUpperCase()}</Tag>}
                style={{
                    paddingLeft: 0,
                }}
            />
            <p>Fully qualified name: <strong>{schema.namespace}.{schema.name}</strong></p>
            <code><ReactMarkdown linkTarget="_blank">{schema.doc || ""}</ReactMarkdown></code>
            {<Table bordered rowKey={() => (i++)} columns={FieldColumns} dataSource={rows} pagination={false} />}
        </>
    );
};

export default Record;
