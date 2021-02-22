import { Layout } from "antd";

const AppHeader = (): JSX.Element => {
    const { Header } = Layout;
    return (
        <Header style={{ textAlign: "center" }}>
            <h1 style={{ color: "#ffffff" }}>AVRO DOCS</h1>
        </Header>
    );
};

export default AppHeader;
