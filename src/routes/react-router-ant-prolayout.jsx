import React from "react";
import {Link} from "react-router-dom";
/*
* ProLayout 配合 React Router
* 配置步骤
* (1) React Router 的 routes 与 ProLayout 的 route 配置，要一致
* (2) React Router useLocation() 获得 pathname, 传递给 ProLayout
* (3) ProLayout 的 menuItem 添加 onClick, 把 pathname 传递给 React Router useNavigate() 动态路由
* (4) 或者，ProLayout 的 menuItem 包裹 React Router 的 <Link>
* (5) 面包屑导航的 linkPath 需要增加 basename 前缀
* */

/*
* ProLayout 的 menuItemRender 在 menuItem 上添加一个 onClick 函数，使用 React Router 的 useNavigate 钩子来跳转路径
* 也可以在 menuItem 上包裹一个 <Link></Link> 来跳转
* */
export function reactRouterNavigateOnClickMenu(navigate){
    return ((item, dom) => {
            return (
                <div
                    onClick={()=>{
                        console.log('useNavigate()', item.path)
                        navigate(item.path)
                    }}
                >
                    {dom}
                    {/*<Link to={item.path}>{dom}</Link>*/}
                </div>
            )
        }
    )
}
/*
* ProLayout 的 menuItemRender 在 menuItem 上添加一个 onClick 函数，使用 React Router 的 useNavigate 钩子来跳转路径
* 也可以在 menuItem 上包裹一个 <Link></Link> 来跳转
* */
export function reactRouterLinkMenu(){
    return ((item, dom) => {
            return (
                <div>
                    <Link to={item.path}>{dom}</Link>
                </div>
            )
        }
    )
}

/*
* 面包屑导航的 linkPath 需要增加 basename 前缀
* */
export function breadcrumbRender(basename){
    return ((routers = []) => {
            console.log('breadcrumbRender', routers)
            return routers.map(router => ({
                ...router,
                linkPath: basename + router.linkPath
            }))
        }
    )
}


/*
* 确保 ProLayout 的 location 属性使用 React Router 的 useLocation 钩子来获取当前路径，从而保持路径的一致性。
* 这样，无论是通过点击菜单导航还是直接在 URL 栏输入路径，界面显示都应该是正确的。
* */
// const location = useLocation();
/*
* ProLayout 的 menuItemRender 在 menuItem 上添加一个 onClick 函数，使用 React Router 的 useNavigate 钩子来跳转路径
* 也可以在 menuItem 上包裹一个 <Link></Link> 来跳转
* */
// const navigate = useNavigate();