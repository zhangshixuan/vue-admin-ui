import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import tableRouter from './modules/table'

/* Router Modules */
// import basicRouter from './modules/basic'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements 没有权限要求的基页
 * all roles can be accessed 所有角色可以访问
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'dashboard', icon: 'dashboard', affix: true }
    }]
  },
  tableRouter
]

/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 */
export let asyncRoutes = [
  // {
  //   path: '/order',
  //   component: Layout,
  //   redirect: '/order/list',
  //   name: 'Order',
  //   meta: { title: '订单管理', roles: ['adminRole'], icon: 'example' },
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'OrderList',
  //       component: () => import('@/views/order/list'),
  //       meta: { title: '订单管理', roles: ['adminRole'], icon: 'list' }
  //     },
  //     {
  //       path: 'create',
  //       name: 'OrderAdd',
  //       component: () => import('@/views/order/create'),
  //       meta: { title: '添加订单', roles: ['adminRole'], icon: 'table' }
  //     },
  //     {
  //       path: 'edit/:id([\\w-]+)',
  //       name: 'OrderEdit',
  //       component: () => import('@/views/order/edit'),
  //       hidden: true,
  //       meta: { title: '修改订单', roles: ['adminRole'], icon: 'table' }
  //     }
  //   ]
  // },
  // {
  //   path: '/giveorder',
  //   component: Layout,
  //   redirect: '/giveorder/list',
  //   name: 'giveOrder',
  //   meta: { title: '赠送管理', roles: ['adminRole'], icon: 'example' },
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'giveOrderList',
  //       component: () => import('@/views/giveorder/list'),
  //       meta: { title: '赠送管理', roles: ['adminRole'], icon: 'list' }
  //     },
  //     {
  //       path: 'create',
  //       name: 'giveOrderAdd',
  //       component: () => import('@/views/giveorder/create'),
  //       meta: { title: '添加赠送', roles: ['adminRole'], icon: 'table' }
  //     },
  //     {
  //       path: 'edit/:id([\\w-]+)',
  //       name: 'giveOrderEdit',
  //       component: () => import('@/views/giveorder/edit'),
  //       hidden: true,
  //       meta: { title: '编辑赠送', roles: ['adminRole'], icon: 'table' }
  //     }
  //   ]
  // },
  // {
  //   path: '/audio',
  //   component: Layout,
  //   redirect: '/audio/list',
  //   name: 'audioOrder',
  //   meta: { title: '音频管理', roles: ['adminRole'], icon: 'example' },
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'audioOrderList',
  //       component: () => import('@/views/audio/list'),
  //       meta: { title: '音频管理', roles: ['adminRole'], icon: 'list' }
  //     },
  //     {
  //       path: 'create',
  //       name: 'audioOrderAdd',
  //       component: () => import('@/views/audio/create'),
  //       meta: { title: '添加音频', roles: ['adminRole'], icon: 'table' }
  //     },
  //     {
  //       path: 'view/:id([\\w-]+)',
  //       name: 'audioOrderView',
  //       component: () => import('@/views/audio/view'),
  //       hidden: true,
  //       meta: { title: '查看音频', roles: ['adminRole'], icon: 'table' }
  //     }
  //   ]
  // },
  // basicRouter,
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  asyncRoutes = [] // 修复重复登陆退出，左侧菜单不清空问题
  router.matcher = newRouter.matcher // reset router
}

export default router
