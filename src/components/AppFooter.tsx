import { Layout } from "antd";

const AppFooter = (): JSX.Element => {
    const { Footer } = Layout;
    return (
        <Footer style={{
            textAlign: "center",
            borderTop: "1px solid navy",
            padding: "0",
        }}>
            Avro Docs 2.0
        </Footer>
    );
};

export default AppFooter;
