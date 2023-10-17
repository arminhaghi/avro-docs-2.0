import { PageHeader, Alert, Tag } from "antd";
import React from "react";
import ReactMarkdown from "react-markdown";
import { ComplexTypes, FixedType, NamedType } from "../models/AvroSchema";
import { TagColorPicker } from "../utils/TagColorPicker";

interface PropsType {
    schema: {
        base: NamedType;
        current: NamedType;
    };
    sourceItemName: string | undefined;
}

const Fixed = (props: PropsType): JSX.Element => {
    const schema = props.schema.current as FixedType;

    return (
        <div style={{ padding: "24px" }}>
            <PageHeader
                title={schema.name}
                tags={<Tag color={TagColorPicker.pick(ComplexTypes.FIXED)}>{ComplexTypes.FIXED.toUpperCase()}</Tag>}
                style={{
                    paddingLeft: 0,
                }}
            />
            <p>Fully qualified name: <strong>{schema.namespace}.{schema.name}</strong></p>
            <code><ReactMarkdown linkTarget="_blank">{schema.doc || ""}</ReactMarkdown></code>
            <Alert message={`Size ${schema.size}`} type="info" showIcon />
        </div>
    );
};

export default Fixed;
