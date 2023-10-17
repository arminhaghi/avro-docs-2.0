import { Layout, Select } from "antd";
import { Link, useHistory, useParams, useLocation } from "react-router-dom";
import { useDataContext } from "../context/data";
import logo from "./logo.png";

const AppHeader = (): JSX.Element => {
    const { Header } = Layout;
    const { Option, OptGroup } = Select;
    const [appData] = useDataContext();
    const history = useHistory();
    const { item } = useParams<{ item: string }>();
    const location = useLocation();

    const selectionHandler = (value) => {
        history.push(`/${value}`);
    };
    const changeHandler = (value) => {
        if (value === undefined && location.pathname !== "/") {
            history.push("/");
        }
    };

    return (
        <Header>
            <div style={{ float: "left" }}>
                <Link to="/">
                    <h1 style={{ color: "#ffffff" }}>
                        <img src={logo} style={{ width: "45px", marginRight: "15px" }} alt="logo" />
                        Avro Docs React
                    </h1>
                </Link>
            </div>
            <div style={{ float: "right" }}>
                <Select
                    showSearch
                    style={{ width: 600 }}
                    placeholder="Select a schema"
                    onSelect={selectionHandler}
                    onChange={changeHandler}
                    allowClear={true}
                    defaultActiveFirstOption={false}
                    value={item}
                    // @ts-ignore
                    filterOption={(input, option) => (option?.value?.toLowerCase().indexOf(input.toLowerCase()) >= 0)}
                >
                    {
                        Array.from(appData.namespaceTree.keys()).map(key => {
                            return (
                                <OptGroup key={key} label={<h3>{key}</h3>}>
                                    {appData.namespaceTree.get(key)?.map(val => <Option key={`${key}.${val}`} value={`${key}.${val}`}>{val}</Option>)}
                                </OptGroup>
                            );
                        })
                    }
                </Select>
            </div>
        </Header>
    );
};

export default AppHeader;
