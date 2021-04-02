import { Table } from "antd";
import { useDataContext } from "./context/data";
import loading from "./loading.png";
import { IndexColumns } from "./models/TableColumns";

const All = (): JSX.Element => {
    let i = 0;
    const [appData] = useDataContext();

    if (appData.failure.length > 0) {
        return <p>Failed Loading Schemas</p>;
    }

    if (appData.schemas.length === 0) {
        return <img src={loading} className="App-logo" alt="loading..." />;
    }

    return (
        <Table
            bordered
            rowKey={() => (i++)}
            columns={IndexColumns}
            dataSource={appData.schemas}
            pagination={{ defaultPageSize: 50, hideOnSinglePage: true, simple: true }}
            scroll={{ y: "82vh", scrollToFirstRowOnChange: true }}
        />
    );
};

export default All;
