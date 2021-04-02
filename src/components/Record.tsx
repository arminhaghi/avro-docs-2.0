import { PageHeader, Table, Tag } from "antd";
import React from "react";
import ReactMarkdown from "react-markdown";
import { AvroSchema, ComplexTypes, NamedType, RecordType, Type } from "../models/AvroSchema";
import { RowData, RecordColumns } from "../models/TableColumns";
import { AvroTypeHelper } from "../utils/AvroTypeHelper";
import { CustomAvroParser } from "../utils/CustomAvroParser";
import { TagColorPicker } from "../utils/TagColorPicker";

interface PropsType {
    schema: {
        base: NamedType;
        current: NamedType;
    };
    sourceItemName: string | undefined;
}

const Record = (props: PropsType): JSX.Element => {
    // If a custom type appears more than once in the schema, only the first appearance of it will have all the details.
    const schema = props.schema.current as RecordType;
    const baseNamespace = schema.namespace;
    const externalTypes: Map<string, Type> = new Map();
    CustomAvroParser.extractExternalTypes(props.schema.base as RecordType, externalTypes, props.schema.base.namespace);

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
        } else if (field && AvroTypeHelper.isArrayType(field.type as AvroSchema)) {
            // @ts-ignore
            const type = field.type.items;
            if (typeof type === "string") {
                // @ts-ignore
                if (type === schema.name && !type.namespace) {
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
                if (type === schema.name && !type.namespace) {
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

        return {
            sourceItemName: props.sourceItemName ? props.sourceItemName : `${schema.namespace}.${schema.name}`,
            defaultNamespace: baseNamespace,
            name: field.name,
            type: field.type,
            defaultValue: field.default === undefined ? "" : JSON.stringify(field.default),
            doc: field.doc,
        };
    });

    let i = 0;

    return (
        <div style={{ padding: "24px" }}>
            <PageHeader
                title={schema.name}
                tags={<Tag color={TagColorPicker.pick(ComplexTypes.RECORD)}>{ComplexTypes.RECORD.toUpperCase()}</Tag>}
                style={{
                    paddingLeft: 0,
                }}
            />
            <p>Fully qualified name: <strong>{schema.namespace}.{schema.name}</strong></p>
            <code><ReactMarkdown linkTarget="_blank">{schema.doc || ""}</ReactMarkdown></code>
            {<Table bordered rowKey={() => (i++)} columns={RecordColumns} dataSource={rows} pagination={false} />}
        </div>
    );
};

export default Record;
