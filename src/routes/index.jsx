import React from "react";
import Home from "../pages/Home";
import ExpirationPlayoffDiagramMultiSeries from "../chartjs/ExpirationPlayoffDiagramMultiSeries";
import {Navigate, Outlet} from "react-router-dom";
import EuropeanCallPutOption from "../components/EuropeanCallPutOption";
import BinaryOption from "../components/BinaryOption";
import Warrant from "../components/Warrant";
import SeriesACs from "../components/SeriesACs";
import SeriesACp from "../components/SeriesACp";
import SeriesARpCs from "../components/SeriesARpCs";
import SeriesAPcp from "../components/SeriesAPcp";
import GenericPayoff from "../components/GenericPayoff";
import Welcome from "../pages/Welcome";
import GenericExpirationPayoffDiagram from "../components/GenericExpirationPayoffDiagram";

// 懒加载, 延时测试效果
// const EuropeanCallPutOption = lazy(() =>
//     new Promise((resolve) =>
//         setTimeout(
//             () => resolve(import("../components/EuropeanCallPutOption")),
//             100)
//     )
// )
// const EuropeanCallPutOption = lazy(() =>import("../components/EuropeanCallPutOption"))
// const Warrant = lazy(() => import("../components/Warrant"))
// const BinaryOption = lazy(() => import("../components/BinaryOption"))
// const SeriesACs = lazy(() => import("../components/SeriesACs"))
// const SeriesARpCs = lazy(() => import("../components/SeriesARpCs"))
// const SeriesACp = lazy(() => import("../components/SeriesACp"))
// const SeriesAPcp = lazy(() => import("../components/SeriesAPcp"))
// const GenericPayoff = lazy(() => import("../components/GenericPayoff"))

// 该router下路由路径的base url. 应该有一个前置斜杠，但不能有后置斜杠
// basename: string
// The base URL for all locations. If your app is served from a sub-directory on your server, you’ll want to set this to
// the sub-directory. A properly formatted basename should have a leading slash, but no trailing slash.
// (1) <BrowserRouter basename={basename}><App/></BrowserRouter>
// (2) 在npm run build之前，需要同时设置package.json， "homepage": "/react-router-app"
//
export const basename = "/vcpe-deal-valuation"

// 如果不需要basename，则可以设置为空字符串
// export const basename = ""

// useRoutes生成路由表
const routes = [
    {
        path: '/',
        element: <Home/>,
        children: [
            {
              path: 'welcome',
              element: <Welcome/>
            },
            {
                path: 'option-warrant',
                element:  <Outlet/>,
                children: [
                    {
                        path: 'european-call-put-option',
                        element: <EuropeanCallPutOption/>,
                    },{
                        path: 'binary-option',
                        element: <BinaryOption/>,
                    },{
                        path: 'warrant',
                        element: <Warrant/>
                    },{
                        path: '*',
                        element: <Navigate to="/option-warrant" />,  // Wildcard route element
                    },
                ]
            },{
                path: 'series-a',
                element:  <Outlet/>,
                children: [
                    {
                        path: 'series-a-cs',
                        element: <SeriesACs/>
                    },{
                        path: 'series-a-rp-cs',
                        element: <SeriesARpCs/>,
                    },{
                        path: 'series-a-cp',
                        element: <SeriesACp/>
                    },{
                        path: 'series-a-pcp',
                        element: <SeriesAPcp/>,
                    },{
                        path: '*',
                        element: <Navigate to="/series-a" />,  // Wildcard route element
                    },
                ],
            },{
                path: 'multi-series',
                element: <Outlet/>,
                children: [
                    {
                        path: 'multi-series',
                        element: <ExpirationPlayoffDiagramMultiSeries/>
                    },{
                        path: '*',
                        element: <Navigate to="/multi-series" />,  // Wildcard route element
                    },
                ]
            },{
                path: 'generic',
                element: <Outlet/>,
                children: [
                    {
                        path: 'generic-payoff',
                        element: <GenericPayoff/>
                    }, {
                        path: 'generic-payoff-diagram',
                        element: <GenericExpirationPayoffDiagram/>
                    }
                ]
            },{
                path: '*',
                element: <Navigate to="/welcome" />,  // Wildcard route element
            },
        ],
    },
]

export default routes