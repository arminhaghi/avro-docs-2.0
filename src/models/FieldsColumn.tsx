import { Badge, Tag } from "antd";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { TagHelper } from "../utils/TagHelper";
import { NamedType } from "./AvroSchema";

export interface RowData {
    // This is only used when namespace is undefuned in type because namespace is the same as parent
    defaultNamespace: string;
    name: string;
    type: any;
    defaultValue: any;
    doc: string;
}

interface Option {
    title: string;
    default: boolean;
}

export interface EnumData {
    option: Option;
    key: string;
}

export const IndexColumns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text: string, record: NamedType): JSX.Element => (
            <Link to={`/${record.namespace}.${text}`}>{text}</Link>
        ),
    },
    {
        title: "Type",
        dataIndex: "type",
        render:  (text: string): JSX.Element => (
            <Tag>
                <strong>{text.toUpperCase()}</strong>
            </Tag>
        ),
    },
    {
        title: "Documentation",
        dataIndex: "doc",
        render: (text: string): JSX.Element => <ReactMarkdown linkTarget="_blank">{text}</ReactMarkdown>,
    },
];

export const FieldColumns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Data Type",
        dataIndex: "type",
        key: "type",
        width: 250,
        render: TagHelper.render,
    },
    {
        title: "Default",
        dataIndex: "defaultValue",
        key: "default",
    },
    {
        title: "Documentation",
        dataIndex: "doc",
        key: "docs",
        render: (text: string): JSX.Element => <ReactMarkdown linkTarget="_blank">{text}</ReactMarkdown>,
    },
];

export const EnumColumns = [
    {
        title: "Options",
        dataIndex: "option",
        key: "option",
        render: (option: Option): JSX.Element => (
            <>
                <span>{option.title}</span>
                {option.default ? <Badge offset={[40, 0]} count={"deserialization default value"} style={{ backgroundColor: "#108ee9" }} /> : null}
            </>

        ),

    },
];
