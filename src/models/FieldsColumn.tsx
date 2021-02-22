import ReactMarkdown from "react-markdown";
import { TagHelper } from "../utils/TagHelper";

export interface RowData {
    name: string;
    type: any;
    defaultValue: any;
    doc: string;
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
