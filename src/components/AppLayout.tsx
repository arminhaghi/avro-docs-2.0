import { Layout, Menu } from "antd";
import { useDataContext } from "../context/data";
// import { useRouter } from "next/router";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";

interface PropsType {
    children: JSX.Element | JSX.Element[];
    // namespaceTree: Map<string, string[]>;
}

const AppLayout = (props: PropsType): JSX.Element => {
    const { Content, Sider } = Layout;
    const { SubMenu } = Menu;
    // const router = useRouter();
    const [appData] = useDataContext();

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
                        defaultOpenKeys={[]}
                        onSelect={({ key }) => {
                            // router.push(key.toString().toLowerCase());
                        }}
                    >
                        {Array.from(appData.namespaceTree.keys()).map(key => {
                            return (
                                <SubMenu key={key} title={key}>
                                    {
                                        // @ts-ignore
                                        appData.namespaceTree.get(key).map(child => (<Menu.Item key={`${key}.${child}`}>{child}</Menu.Item>))
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
