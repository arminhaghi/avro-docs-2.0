import { PageHeader, Table, Tag } from "antd";
import React from "react";
import ReactMarkdown from "react-markdown";
import { ComplexTypes, EnumType, NamedType, RecordType, Type } from "../models/AvroSchema";
import { RowData, RecordColumns, EnumData, EnumColumns } from "../models/TableColumns";
import { CustomAvroParser } from "../utils/CustomAvroParser";
import { EnumMapper, FieldMapper } from "../utils/FieldHelper";
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
    const externalTypes: Map<string, Type> = new Map();
    CustomAvroParser.extractExternalTypes(props.schema.base as RecordType, externalTypes, props.schema.base.namespace);

    const rows: RowData[] = FieldMapper(props.schema.base as RecordType, schema, props.sourceItemName);

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
            {<Table
                bordered
                columns={RecordColumns}
                dataSource={rows}
                pagination={false}
                expandable={{
                    expandRowByClick: false,
                    expandIconColumnIndex: 0,
                    expandedRowRender: (record) => {
                        if (record.type.type === ComplexTypes.ENUM) {
                            const innerRows: EnumData[] = EnumMapper(record.type as EnumType);
                            return <Table bordered columns={EnumColumns} dataSource={innerRows} pagination={false} />;
                        } else {
                            return <></>;
                        }
                    },
                    rowExpandable: (record) => (record.type.type === ComplexTypes.ENUM || record.children.length > 0),
                    // rowExpandable: (record) => (record.type.type === ComplexTypes.ENUM),
                }}
            />}
        </div>
    );
};

export default Record;
