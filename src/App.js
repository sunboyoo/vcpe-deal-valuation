import {useRoutes} from "react-router-dom";
import routes from "./routes";
import {test} from "./lib/series";
import {
    Chart as ChartJS,
        CategoryScale,
        LinearScale,
        LineElement,
        PointElement,
        Title,
        Tooltip,
        Legend,
        Filler,
        SubTitle,
} from "chart.js";

import {Line} from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    SubTitle
)

function App() {
    // useRoutes生成路由表
    const element = useRoutes(routes)
    const {x, y} = test();
  return (
      <>
          {/* 注册路由 */}
          {element}

          <Line
              data={{
                labels: x,
                datasets: [{
                  label: 'PV4',
                  data: y.y0,
                },{
                    label: 'PV5',
                    data: y.y1,
                },{
                    label: 'PV5',
                    data: y.y2,
                },{
                    label: 'PV5',
                    data: y.y3,
                },{
                    label: 'PV4',
                    data: y.y1,
                },{
                    label: 'PV5',
                    data: y.y1,
                }
                ]
              }}

          ></Line>
      </>
  );
}

export default App;
