import { Tag } from "antd";
import ReactMarkdown from "react-markdown";
import { TagColorPicker } from "../utils/TagColorPicker";

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
        render: (data: any) => {
            return (<Tag color={TagColorPicker.pick(data.branchName)}>{data.branchName?.toUpperCase()}</Tag>);
        },
    },
    {
        title: "Documentation",
        dataIndex: "doc",
        key: "docs",
        render: (text: string) => <ReactMarkdown linkTarget="_blank">{text}</ReactMarkdown>,
    },
];
