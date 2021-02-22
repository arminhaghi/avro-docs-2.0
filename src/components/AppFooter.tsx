import { Layout } from "antd";

const AppFooter = (): JSX.Element => {
    const { Footer } = Layout;
    return (
        <Footer style={{
            textAlign: "center",
            borderTop: "1px solid navy",
            padding: "0",
        }}>
            Avro Docs - Created by Armin
        </Footer>
    );
};

export default AppFooter;
