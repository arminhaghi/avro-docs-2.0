import { Select } from "antd";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { useDataContext } from "./context/data";

const Home = (): JSX.Element => {
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
        <div style={{ width: "50%", margin: "auto" }}>
            <h2>Welcome to Avro Docs</h2>
            <Select
                showSearch
                style={{ width: 800 }}
                placeholder="Search for a schema"
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


    );
};

export default Home;
