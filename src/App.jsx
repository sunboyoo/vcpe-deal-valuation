import {useRoutes} from "react-router-dom";
import routes from "./routes";
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US'; // 引入英文语言包
import React from "react";

function App() {
    // useRoutes生成路由表
    const element = useRoutes(routes)

  return (
      <>
          <ConfigProvider locale={enUS}>
              {/* 注册路由 */}
              {element}
          </ConfigProvider>
      </>
  );
}

export default App;
