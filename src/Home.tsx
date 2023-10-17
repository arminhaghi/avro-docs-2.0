import { Layout } from "antd";
import { Select } from "antd";
import { useHistory, useParams, useLocation } from "react-router-dom";
import logo from "./components/logo-1.png";
import { useDataContext } from "./context/data";

const Home = (): JSX.Element => {
    const { Content } = Layout;
    const { Option, OptGroup } = Select;
    const [appData] = useDataContext();
    const history = useHistory();
    const { item } = useParams<{ item: string }>();
    const location = useLocation();

    const selectionHandler = (value: any) => {
        history.push(`/${value}`);
    };
    const changeHandler = (value: any) => {
        if (value === undefined && location.pathname !== "/") {
            history.push("/");
        }
    };

    return (
        <Layout style={{
            height: "100vh",
            backgroundColor: "#00092D",
        }}>
            <Content className="content-layout">
                <img src={logo} style={{ display: "block", margin: "auto", width: "300px", marginTop: 100 }} alt="home-logo" />
                <div style={{ marginTop: 100, textAlign: "center" }}>
                    <h2 style={{ color: "white" }}>Start by selecting or searching for a type</h2>
                    <Select
                        showSearch
                        style={{ width: "50%" }}
                        placeholder="Search for a schema"
                        onSelect={selectionHandler}
                        onChange={changeHandler}
                        allowClear={true}
                        defaultActiveFirstOption={false}
                        size="large"
                        autoFocus
                        value={item}
                        notFoundContent={<p style={{ color: "#a53a00" }}>No Match Found!</p>}
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
            </Content>
        </Layout>

    );
};

export default Home;
