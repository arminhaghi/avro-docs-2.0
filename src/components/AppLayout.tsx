import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDataContext } from "../context/data";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";

interface PropsType {
    children: JSX.Element | JSX.Element[];
}

const AppLayout = (props: PropsType): JSX.Element => {
    const { Content, Sider } = Layout;
    const { SubMenu } = Menu;
    const [appData] = useDataContext();
    const params = useParams<{ item?: string }>();
    const item = params.item || "";

    return (
        <Layout>
            <AppHeader />
            <Layout style={{
                height: "calc(100vh - 88px)",
            }}>
                <Sider className="sider-layout" width={300}>
                    <Menu
                        mode="inline"
                        theme="dark"
                        forceSubMenuRender={true}
                        inlineCollapsed={false}
                        selectedKeys={[item]}
                        openKeys={[item.substring(0, item.lastIndexOf("."))]}
                    >
                        {Array.from(appData.namespaceTree.keys()).map(key => {
                            return (
                                <SubMenu key={key} title={key}>
                                    {
                                        // @ts-ignore
                                        appData.namespaceTree.get(key).map(child => {
                                            const childKey = `${key}.${child}`;
                                            return (
                                                <Menu.Item key={childKey}>
                                                    <Link to={`/${childKey}`}>{child}</Link>
                                                </Menu.Item>
                                            );
                                        })
                                    }
                                </SubMenu>
                            );
                        })}
                    </Menu>
                </Sider>
                <Content className="content-layout">
                    {props.children}
                </Content>
            </Layout>
            <AppFooter />
        </Layout>
    );
};

export default AppLayout;
