import { Tag, Tooltip } from "antd";
import { Link } from "react-router-dom";

export interface TagData {
    text: string;
    tooltip: string;
    path?: string;
}

interface PropsType {
    data: TagData;
    color: string;
}

const DataType = (props: PropsType): JSX.Element => {
    const { data, color } = props;

    return (
        <Tooltip title={data.tooltip} mouseEnterDelay={0.4}>
            <Tag color={color}>
                {data.path ? <Link to={`/${data.path}`}>{data.text}</Link> : data.text}
            </Tag>
        </Tooltip>
    );
};

export default DataType;
