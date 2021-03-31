import { Layout } from "antd";
import { Link } from "react-router-dom";
import logo from "./logo.png";

const AppHeader = (): JSX.Element => {
    const { Header } = Layout;
    return (
        <Header>
            <Link to="/">
                <h1 style={{ color: "#ffffff" }}>
                    <img src={logo} style={{ width: "50px", marginRight: "15px" }} alt="logo" />Avro Docs React
                </h1>
            </Link>
        </Header>
    );
};

export default AppHeader;
