import {Layout, Space, Spin} from "antd";
import {lazy, Suspense} from "react";
import {Content} from "antd/es/layout/layout";
import {Outlet, useNavigate} from "react-router-dom";

const Navigation = lazy(() => import("../Navigation"));

export default function Home() {
    // hook函数，可以实现编程式导航
    const navigate = useNavigate()

    function onMenuSelection(key){
        // setMenuSelection(key)
        navigate("/"+key)
    }
    return (
        <Layout justify="center" align="middle">
            <Space direction="vertical" >
                {/* Suspense贴近包裹懒加载对象,那么fallback的动画会出现在懒加载对象应该出现的位置 */}
                <Suspense fallback={<Spin/>}>
                    <Navigation onMenuSelection={onMenuSelection}/>
                </Suspense>

                <Content style={{backgroundColor: "rgb(240, 242, 245)"}}>
                    <Space><p/></Space>
                    {/* Suspense贴近包裹懒加载对象,那么fallback的动画会出现在懒加载对象应该出现的位置 */}
                    <Suspense fallback={<Spin/>}>
                        <Outlet/>
                    </Suspense>
                </Content>
            </Space>
        </Layout>
    )
}