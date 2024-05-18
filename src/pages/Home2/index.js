import {Layout, Space, Spin} from "antd";
import {lazy, Suspense} from "react";
import {Content, Header} from "antd/es/layout/layout";
import {Outlet, useNavigate} from "react-router-dom";
import {PageContainer, ProLayout} from "@ant-design/pro-components";
import {defaultSettings} from "../../models/setting";

const Navigation = lazy(() => import("../Navigation"));

export default function () {
    // hook函数，可以实现编程式导航
    const navigate = useNavigate()

    function onMenuSelection(key){
        // setMenuSelection(key)
        navigate("/"+key)
    }
    return (
        <ProLayout justify="center" align="middle">
            {/*<Space direction="vertical" >*/}
            <PageContainer>
                <Header>
                    {/* Suspense贴近包裹懒加载对象,那么fallback的动画会出现在懒加载对象应该出现的位置 */}
                    <Suspense fallback={<Spin/>}>
                        <Navigation onMenuSelection={onMenuSelection}/>
                    </Suspense>
                </Header>
                <Content style={{backgroundColor: "rgb(240, 242, 245)"}}>
                    <Space><p/></Space>
                    {/* Suspense贴近包裹懒加载对象,那么fallback的动画会出现在懒加载对象应该出现的位置 */}
                    <Suspense fallback={<Spin/>}>
                        <Outlet/>
                    </Suspense>
                </Content>
            </PageContainer>
            {/*</Space>*/}
        </ProLayout>
    )
}