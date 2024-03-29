import { PageHeader, Table, Tag } from "antd";
import React from "react";
import ReactMarkdown from "react-markdown";
import { ComplexTypes, EnumType, NamedType } from "../models/AvroSchema";
import { EnumColumns, EnumData } from "../models/TableColumns";
import { EnumMapper } from "../utils/FieldHelper";
import { TagColorPicker } from "../utils/TagColorPicker";

interface PropsType {
    schema: NamedType;
}

const Enum = (props: PropsType): JSX.Element => {
    const schema = props.schema as EnumType;
    const enumName = schema.name.substring(schema.name.lastIndexOf(".") + 1);

    const rows: EnumData[] = EnumMapper(schema);

    return (
        <div style={{ padding: "24px" }}>
            <PageHeader
                title={enumName}
                tags={<Tag color={TagColorPicker.pick(ComplexTypes.ENUM)}>{ComplexTypes.ENUM.toUpperCase()}</Tag>}
                style={{
                    paddingLeft: 0,
                }}
            />
            <p>Fully qualified name: <strong>{schema.namespace}.{schema.name}</strong></p>
            <code><ReactMarkdown linkTarget="_blank">{schema.doc || ""}</ReactMarkdown></code>
            <Table bordered columns={EnumColumns} dataSource={rows} pagination={false} />
        </div>
    );
};

export default Enum;
