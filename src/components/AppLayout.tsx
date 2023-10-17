import { Layout } from "antd";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";

interface PropsType {
    children: JSX.Element | JSX.Element[];
}

const AppLayout = (props: PropsType): JSX.Element => {
    const { Content } = Layout;

    return (
        <Layout>
            <AppHeader />
            <Layout style={{
                height: "calc(100vh - 88px)",
            }}>
                <Content className="content-layout">
                    {props.children}
                </Content>
            </Layout>
            <AppFooter />
        </Layout>
    );
};

export default AppLayout;
