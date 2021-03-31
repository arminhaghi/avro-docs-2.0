import { Table } from "antd";
import { useDataContext } from "./context/data";
import { IndexColumns } from "./models/FieldsColumn";

const All = (): JSX.Element => {
    let i = 0;
    const [appData] = useDataContext();

    if (appData.schemas.length === 0) {
        return <p>Loading or no schemas found!</p>;
    }

    return (
        <Table
            bordered
            rowKey={() => (i++)}
            columns={IndexColumns}
            dataSource={appData.schemas}
            size="small"
            pagination={{ defaultPageSize: 50, hideOnSinglePage: true, simple: true }}
            scroll={{ y: "88vh", x: true, scrollToFirstRowOnChange: true }}
        />
    );
};

export default All;
