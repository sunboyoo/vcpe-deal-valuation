import React, { useState} from 'react';
import {
    DefaultFooter,
    PageContainer,
    ProConfigProvider,
    ProLayout,
    SettingDrawer,
} from '@ant-design/pro-components';
import {
    ConfigProvider,
} from 'antd';
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {basename} from "../../routes";
import {route} from "../../routes/prolayout-route";
import {reactRouterNavigateOnClickMenu, breadcrumbRender} from "../../routes/react-router-ant-prolayout"

const proLayoutDefaultSettings = {
    title: 'Emory Center For Alternative Investments',
    "fixSiderbar": true,
    "layout": "top",
    "splitMenus": false,
    "navTheme": "light",
    "contentWidth": "Fluid",
    "colorPrimary": "#1677FF",
    "fixedHeader": true,
}


const App = () => {
    const [settings, setSetting] = useState(proLayoutDefaultSettings);
    /*
    * 确保 ProLayout 的 location 属性使用 React Router 的 useLocation 钩子来获取当前路径，从而保持路径的一致性。
    * 这样，无论是通过点击菜单导航还是直接在 URL 栏输入路径，界面显示都应该是正确的。
    * */
    const location = useLocation();
    /*
    * ProLayout 的 menuItemRender 在 menuItem 上添加一个 onClick 函数，使用 React Router 的 useNavigate 钩子来跳转路径
    * 也可以在 menuItem 上包裹一个 <Link></Link> 来跳转
    * */
    const navigate = useNavigate();

    console.log('useLocation()', location);

    if (typeof document === 'undefined') {
        return <div />;
    }
    return (
        <div
            id="pro-layout-zocochucrecophatatra"
            style={{
                height: '100vh',
                overflow: 'auto',
                }}
        >
            <ProConfigProvider hashed={false}>
                <ConfigProvider
                    getTargetContainer={() => {
                        return document.getElementById('pro-layout-zocochucrecophatatra') || document.body;
                    }}
                >
                    <ProLayout
                        logo={false}
                        title='Emory Center For Alternative Investments'
                        prefixCls="my-prefix"
                        route={route}
                        // React Router 传递 location 给 ProLayout
                        location={location}
                        token={{
                            header: {
                                colorBgMenuItemSelected: 'rgba(0,0,0,0.04)',
                            },
                        }}
                        menu={{
                            collapsedShowGroupTitle: true,
                        }}
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
                        breadcrumbRender={breadcrumbRender(basename)}
                        menuItemRender={reactRouterNavigateOnClickMenu(navigate)}
                        {...settings}
                    >
                        <PageContainer
                            extra={undefined}
                            footer={undefined}
                        >
                            <div
                                style={{textAlign: 'center'}}
                            >
                                <Outlet/>
                                <DefaultFooter
                                    copyright={`${new Date().getFullYear()} Emory Center for Alternative Investments`}
                                    links={[
                                        {
                                            key: 'Kevin Liu',
                                            title: 'Developed by Kevin Liu,',
                                            href: 'https://www.linkedin.com/in/kevinlcm',
                                            blankTarget: true,
                                        },
                                        {
                                            key: 'Klass Baks',
                                            title: 'under the guidance of Professor Klass Baks',
                                            href: 'http://klaasbaks.com/',
                                            blankTarget: true,
                                        },
                                    ]}
                                />
                                <a href="https://github.com/sunboyoo/vcpe-deal-valuation" target="_blank">
                                    <img
                                        src="https://img.shields.io/github/stars/sunboyoo/vcpe-deal-valuation?style=social"
                                        alt="Star on GitHub"/>
                                </a> <br/><br/>
                                <a href="https://github.com/sunboyoo/vcpe-deal-valuation/issues/new" target="_blank">
                                    <img src="https://img.shields.io/badge/Report%20an%20Issue-Click%20Here-brightgreen"
                                         alt="Report an Issue"/>
                                </a>
                            </div>
                        </PageContainer>

                        <SettingDrawer
                            pathname={location.pathname}
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
