import React, { useState} from 'react';
import {
    PageContainer,
    ProConfigProvider,
    ProLayout,
    SettingDrawer,
} from '@ant-design/pro-components';
import {
    ConfigProvider,
} from 'antd';
import {Link, Outlet, useLocation} from "react-router-dom";
import {route} from "./route";
import {basename} from "../../routes";

const App = () => {
    const [settings, setSetting] = useState({
        fixSiderbar: true,
        layout: 'mix',
        splitMenus: true,
    });

    const [pathname, setPathname] = useState('/');
    const [num, setNum] = useState(40);

    /*
    * 确保 ProLayout 的 location 属性使用 React Router 的 useLocation 钩子来获取当前路径，从而保持路径的一致性。
    * 这样，无论是通过点击菜单导航还是直接在 URL 栏输入路径，界面显示都应该是正确的。
    * */
    const location = useLocation();


    if (typeof document === 'undefined') {
        return <div />;
    }
    return (
        <div
            id="test-pro-layout"
            style={{
                height: '100vh',
                overflow: 'auto',
            }}
        >
            <ProConfigProvider hashed={false}>
                <ConfigProvider
                    getTargetContainer={() => {
                        return document.getElementById('test-pro-layout') || document.body;
                    }}
                >
                    <ProLayout
                        prefixCls="my-prefix"
                        logo={false}
                        route={route}
                        //
                        location={location}
                        token={{
                            header: {
                                colorBgMenuItemSelected: 'rgba(0,0,0,0.04)',
                            },
                        }}
                        siderMenuType="group"
                        menu={{
                            collapsedShowGroupTitle: true,
                        }}

                        headerTitleRender={(logo, title, _) =>
                             (
                                <a href="http://emorycai.com/">
                                    {/*{logo}*/}
                                    {'Emory CAI'}
                                </a>
                             )
                        }
                        menuFooterRender={(props) => {
                            if (props?.collapsed) return undefined;
                            return (
                                <div
                                    style={{
                                        textAlign: 'center',
                                        paddingBlockStart: 12,
                                    }}
                                >
                                    <div>© {new Date().getFullYear()} Emory Center for Alternative Investments</div>
                                    <div><a href="https://www.linkedin.com/in/kevinlcm" target="_blank" rel="noopener noreferrer">by Kevin Liu</a></div>
                                </div>
                            );
                        }}
                        onMenuHeaderClick={(e) => console.log(e)}
                        breadcrumbRender={(routers = []) => {
                            return routers.map(router => ({...router, linkPath: basename + router.linkPath}))
                        }}
                        menuItemRender={(item, dom) => {
                                return (
                                    <div
                                        onClick={() => {
                                            setPathname(item.path);
                                        }}
                                    >
                                        {
                                            <Link to={item.path}>{dom}</Link>
                                        }
                                    </div>
                                )
                            }}
                        {...settings}
                    >
                        <PageContainer
                            token={{
                                paddingInlinePageContainerContent: num,
                            }}
                            extra={undefined}
                            footer={undefined}
                        >
                            <div
                                style={{textAlign: 'center'}}
                            >
                                <Outlet/>
                            </div>
                        </PageContainer>

                        <SettingDrawer
                            pathname={pathname}
                            enableDarkTheme
                            getContainer={(e) => {
                                if (typeof window === 'undefined') return e;
                                return document.getElementById('test-pro-layout');
                            }}
                            settings={settings}
                            onSettingChange={(changeSetting) => {
                                setSetting(changeSetting);
                            }}
                            disableUrlParams={false}
                        />
                    </ProLayout>
                </ConfigProvider>
            </ProConfigProvider>
        </div>
    );
};

export default App;
