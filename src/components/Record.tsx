import { PageHeader, Table, Tag } from "antd";
import * as AVRO from "avsc";
import React from "react";
import ReactMarkdown from "react-markdown";
import { RowData, FieldColumns } from "../models/FieldsColumn";
import { TagColorPicker } from "../utils/TagColorPicker";
import { TypeHelper } from "../utils/TypeHelper";

interface PropsType {
    schema: AVRO.Type;
}

const Record = (props: PropsType): JSX.Element => {
    const { schema } = props;
    let i = 0;

    if (schema && schema.name) {
        const rows: RowData[] = (schema as AVRO.types.RecordType).fields.map(field => {
            return {
                name: field.name,
                type: field.type,
                defaultValue: TypeHelper.formatDefaultValue(field.defaultValue()),
                // @ts-ignore
                doc: field.doc,
            };
        });

        return (
            <>
                <PageHeader
                    title={schema.name.substring(schema.name.lastIndexOf(".") + 1)}
                    tags={<Tag color={TagColorPicker.pick(schema.typeName)}>{schema.typeName.toUpperCase()}</Tag>}
                    style={{
                        paddingLeft: 0,
                    }}
                />
                <p>Fully qualified name: <strong>{schema.name}</strong></p>
                <p>Type: <strong>{schema.typeName}</strong></p>
                <code><ReactMarkdown linkTarget="_blank">{schema.doc || ""}</ReactMarkdown></code>
                {<Table bordered rowKey={() => (i++)} columns={FieldColumns} dataSource={rows} pagination={false} />}
            </>
        );
    }

    return <></>;
};

export default Record;
