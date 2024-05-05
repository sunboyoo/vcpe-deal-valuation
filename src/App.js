import {useRoutes} from "react-router-dom";
import routes from "./routes";

function App() {
    // useRoutes生成路由表
    const element = useRoutes(routes)

  return (
      <>
          {/* 注册路由 */}
          {element}
      </>
  );
}

export default App;
