import { Badge } from "antd";
import React from "react";
import ReactMarkdown from "react-markdown";
import { TagHelper } from "../utils/TagHelper";

export interface RowData {
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
                {option.default ? <Badge offset={[40, 0]} count={"default value"}/> : null}
            </>

        ),

    },
];
