import {Layout, Space, Spin} from "antd";
import {Content} from "antd/es/layout/layout";
import {lazy, Suspense} from "react";
import {useNavigate, useRoutes} from "react-router-dom";
import routes from "./routes";

const Navigation = lazy(() => import("./pages/Navigation"))

function App() {
    // hook函数，可以实现编程式导航
    const navigate = useNavigate()

    // useRoutes生成路由表
    const element = useRoutes(routes)

    function onMenuSelection(key){
            // setMenuSelection(key)
        navigate("/"+key)
    }

  return (
    <div className="App" >


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
                        {/* 注册路由 */}
                        {element}
                    </Suspense>
                </Content>
            </Space>
        </Layout>
    </div>
  );
}

export default App;
