import {lazy} from "react";

// 懒加载, 延时测试效果
// const EuropeanCallPutOption = lazy(() =>
//     new Promise((resolve) =>
//         setTimeout(
//             () => resolve(import("../components/EuropeanCallPutOption")),
//             100)
//     )
// )
const EuropeanCallPutOption = lazy(() =>import("../components/EuropeanCallPutOption"))
const Warrant = lazy(() => import("../components/Warrant"))
const BinaryOption = lazy(() => import("../components/BinaryOption"))
const SeriesACs = lazy(() => import("../components/SeriesACs"))
const SeriesARpCs = lazy(() => import("../components/SeriesARpCs"))
const SeriesACp = lazy(() => import("../components/SeriesACp"))
const SeriesAPcp = lazy(() => import("../components/SeriesAPcp"))
const GenericPayoff = lazy(() => import("../components/GenericPayoff"))


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
        path: '/europeanCallPutOption',
        element: <EuropeanCallPutOption/>
    },{
        path: '/binaryOption',
        element: <BinaryOption/>,
    },{
        path: '/warrant',
        element: <Warrant/>
    },
    {
        path: '/seriesACs',
        element: <SeriesACs/>
    },{
        path: '/seriesARpCs',
        element: <SeriesARpCs/>,
    },{
        path: '/seriesACp',
        element: <SeriesACp/>
    },{
        path: '/seriesAPcp',
        element: <SeriesAPcp/>,
    },{
        path: '/genericPayoff',
        element: <GenericPayoff/>
    },{
        path: '/',
        element: <></>
    }
]

export default routes