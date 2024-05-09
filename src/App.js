import {useRoutes} from "react-router-dom";
import routes from "./routes";
import {test} from "./lib/series";

function App() {
    // useRoutes生成路由表
    const element = useRoutes(routes)
    test();
  return (
      <>
          {/* 注册路由 */}
          {element}
      </>
  );
}

export default App;
