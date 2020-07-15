## 简介
[neupals-neuabc-admin-ui] 是一个后台前端框架，在[vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)基础上增加了tabs-view、国际化、后台动态加载餐单、菜单权限等。它基于 [vue](https://github.com/vuejs/vue) 和 [element-ui](https://github.com/ElemeFE/element)实现。


## 前序准备
你需要在本地安装 [node](http://nodejs.org/) 和 [git](https://git-scm.com/)。


## 本项目技术栈
- [ES2015+(es6)](http://es6.ruanyifeng.com/)
- [vue](https://cn.vuejs.org/index.html)
- [vuex](https://vuex.vuejs.org/zh-cn/)
- [vue-router](https://router.vuejs.org/zh-cn/)
- [vue-cli](https://github.com/vuejs/vue-cli)
- [axios](https://github.com/axios/axios)
- [element-ui](https://github.com/ElemeFE/element)
- [Mock.js](https://github.com/nuysoft/Mock)进行模拟（也可以自行编写服务端接口）


## 运行环境
- node 8.16.0
- vsCode开发工具
- Typora文本工具（readme.md）


## 开发
```bash
# 进入项目目录
cd neupals-neuabc-admin-ui

# 安装依赖
npm install

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9528


## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```



## 架构运行流程以及代码讲解

1. 开发前，可修改.env.development文件中VUE_APP_BASE_API请求根地址，如：http://localhost:8080。可能会遇到跨域问题。前端利用proxy代理，后端可以加个过滤器。[点击参考](https://blog.csdn.net/wh_xmy/article/details/87705840)

   也可以使用mock-server，请求模拟数据

2. 登陆：项目启动后，浏览器输入http://localhost:9528，通过路由文件router/index.js中配置的属性，页面跳转到view/login/index.vue页面。输入用户名和密码点击登陆，会派发（dispatch）一个actions->login方法(ps:这里对axios进行了封装，在src/utils/reques.js中)。因为登陆后需要更新头像、角色、token等信息，这些信息其他组件也需要共有，所以这里使用了vuex状态管理。

   ```js
   login({ commit }, userInfo) {
       const { username, password } = userInfo
       return new Promise((resolve, reject) => {
         login({ username: username.trim(), password: password }).then(response => {
           const { data } = response
           commit('SET_TOKEN', data.token)//调用mutations中SET_TOKEN方法，改变state中token属性值
           setToken(data.token)//更新了Cookie中token
           resolve()
         }).catch(error => {
           reject(error)
         })
       })
   },
   ```

   [^store/modules/user.js]: 文件位置

3. 获取用户信息：用户登录成功之后，会在全局钩子`router.beforeEach`中拦截路由，判断是否已获得token，在获得token之后就要去获取用户的基本信息了 

   ```js
   router.beforeEach(async(to, from, next) => {
     // start progress bar
     NProgress.start()
   
     // set page title
     document.title = getPageTitle(to.meta.title)
   
     // determine whether the user has logged in 确定用户是否已登录
     const hasToken = getToken()
   
     if (hasToken) {
       if (to.path === '/login') {
         // if is logged in, redirect to the home page 如果已登录，请重定向到主页
         next({ path: '/' })
         NProgress.done()
       } else {
         // determine whether the user has obtained his permission roles through getInfo
         // 确定用户是否已通过getInfo获得其权限角色
         const hasRoles = store.getters.roles && store.getters.roles.length > 0
         if (hasRoles) {
           next()
         } else {
           try {
             // get user info
             const { roles } = await store.dispatch('user/getInfo')
   
             // generate accessible routes map based on roles 基于角色生成可访问路由图
             const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
   
             // dynamically add accessible routes 动态添加可访问路由
             router.addRoutes(accessRoutes)
   
             // hack method to ensure that addRoutes is complete
             // set the replace: true, so the navigation will not leave a history record
             next({ ...to, replace: true })
           } catch (error) {
             // remove token and go to login page to re-login
             await store.dispatch('user/resetToken')
             Message.error(error || 'Has Error')
             next(`/login?redirect=${to.path}`)
             NProgress.done()
           }
         }
       }
     } else {
       /* has no token*/
   
       if (whiteList.indexOf(to.path) !== -1) {
         // in the free login whitelist, go directly
         next()
       } else {
         // other pages that do not have permission to access are redirected to the login page.
         next(`/login?redirect=${to.path}`)
         NProgress.done()
       }
     }
   })
   ```

   [^permission.js]: 文件位置

4. 显示登陆后管理页面：在router/index.js文件中引入了layout/index.vue组件

   ```js
   /* Layout */
   import Layout from '@/layout'
   ```

   在配置路由的时候，path: '/'加载的是layout/index.vue组件

   ```js
     {
       path: '/',
       component: Layout,
       redirect: '/dashboard',
       children: [
         {
           path: 'dashboard',
           component: () => import('@/views/dashboard/index'),
           name: 'Dashboard',
           meta: { title: 'dashboard', icon: 'dashboard', affix: true }
         }
       ]
     },
   ```

   所以router-view渲染的是layout/index.vue组件。该组件又嵌套了Sidebar 、AppMain、Navbar 等等

   用谷歌浏览器安装vue Devtools插件，可查看vue Components

   这样整个登陆后的页面就显示出来了。

5. 渲染左侧菜单栏：

   - 首先layout/index.vue页面会加载Sidebar组件

     ```vue
     import { AppMain, Navbar, Sidebar, TagsView } from './components'
     ```

   - 之后layout/components/Sidebar/index.vue中动态生成菜单

     ```vue
     <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
     ```

6. 加载中间工作区域组件：

   - 上面提到layout/index.vue嵌套了AppMain组件，寻找文件在layout/components/AppMain.vue。打开文件发现在computed属性中有key方法

     ```vue
       computed: {
         cachedViews() {
           return this.$store.state.tagsView.cachedViews
         },
         key() {
           return this.$route.path
         }
       }
     ```

     在router-view视图渲染的是path值

     ```vue
     <router-view :key="key" />
     ```

     这样，工作区域的组件也加载出来了

7. 动态后台请求路由：

   - 在store/modules/permission.js中，修改generateRoutes方法，循环后台路由地址

     

     

     
