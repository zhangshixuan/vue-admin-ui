import { asyncRoutes, constantRoutes } from '@/router'
import { getAuthMenu } from '@/api/menu'
import { Message } from 'element-ui'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * 使用meta.role确定当前用户是否具有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * 递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
export function generaMenu(routes, data) {
  data.forEach(item => {
    let menu = {}
    let hiddenFalg = false
    // 如果是2，需要隐藏
    if (item.attr1 === '2') {
      hiddenFalg = true
    }
    if (item.url.indexOf(':') > -1) {
      // url中带：号的这种，是编辑，path和component不一样
      const componentUrl = item.url.substring(0, item.url.lastIndexOf('/'))
      menu = {
        path: item.url === '#' ? item.url + item.id + '_key' : item.url, // item.menu_id + '_key':保持唯一性 否则会报错
        // component: item.url === '#' ? Layout : () => import(`@/views${componentUrl}`),
        component: item.url === '#' ? Layout : resolve => require([`@/views${componentUrl}`], resolve),
        children: [],
        hidden: hiddenFalg,
        // name: 'menu_' + item.id,
        name: item.code, // name要与页面对应的name一致
        meta: { title: item.title, icon: `${item.icon}` }
      }
    } else {
      menu = {
        path: item.url === '#' ? item.url + item.id + '_key' : item.url, // item.menu_id + '_key':保持唯一性 否则会报错
        // component: item.url === '#' ? Layout : () => import(`@/views${item.url}`),
        component: item.url === '#' ? Layout : resolve => require([`@/views${item.url}`], resolve),
        children: [],
        hidden: hiddenFalg,
        // name: 'menu_' + item.id,
        name: item.code, // name要与页面对应的name一致
        meta: { title: item.title, id: item.id, icon: `${item.icon}` }
      }
    }

    if (item.children) {
      generaMenu(menu.children, item.children)
    }
    routes.push(menu)
  })
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      const loadMenuData = []
      // 先查询后台并返回左侧菜单数据并把数据添加到路由
      getAuthMenu().then(response => {
        const { code } = response
        const { data } = response
        if (code !== 200) {
          Message.error({
            message: '菜单加载异常，请联系管理员'
          })
        } else {
          let menuData = []
          let accessedRoutes = []
          for (const one of data) {
            if (one.code === 'msms') {
              menuData = one.children
            }
          }
          Object.assign(loadMenuData, menuData)
          generaMenu(asyncRoutes, loadMenuData)
          // 因为是后台返回菜单列表，不需要在前端动态判断添加的菜单项
          // if (roles.includes('admin')) {
          //   // alert(JSON.stringify(asyncRoutes))
          //   accessedRoutes = asyncRoutes || []
          // } else {
          //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
          // }
          accessedRoutes = asyncRoutes || []
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        }
      }).catch(error => {
        console.log(error)
        Message.error({
          message: '菜单加载异常，请联系管理员'
        })
      })

      // 前台页面路由，请打开下面的注释，将上面的代码注释
      // let accessedRoutes
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      //   // accessedRoutes = []
      // }
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
