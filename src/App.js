import {useRoutes} from "react-router-dom";
import routes from "./routes";
import ExpirationPlayoffDiagramMultiSeries from "./chartjs/ExpirationPlayoffDiagramMultiSeries";

function App() {
    // useRoutes生成路由表
    const element = useRoutes(routes)

  return (
      <>
          {/* 注册路由 */}
          {element}
          <ExpirationPlayoffDiagramMultiSeries/>
      </>
  );
}

export default App;
