import { PageHeader, Table, Tag } from "antd";
import * as AVRO from "avsc";
import React from "react";
import ReactMarkdown from "react-markdown";
import { EnumColumns, EnumData } from "../models/FieldsColumn";
import { TagColorPicker } from "../utils/TagColorPicker";

interface PropsType {
    schema: AVRO.Type;
}

const Enum = (props: PropsType): JSX.Element => {
    const { schema } = props;
    let i = -1;

    if (schema && schema.name) {
        const rows: EnumData[] = (schema as AVRO.types.EnumType).symbols.map((symbol) => {
            i++;
            return {
                option: {
                    title: symbol,
                    default: i === 0,
                },
                key: i.toString(),
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
                <Table bordered columns={EnumColumns} dataSource={rows} pagination={false} />
            </>
        );
    }

    return <></>;
};

export default Enum;
