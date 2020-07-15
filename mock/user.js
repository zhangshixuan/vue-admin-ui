import Mock from 'mockjs'

const tokens = {
  admin: {
    token: Mock.Random.guid().toLowerCase().replace(/-/g, '')
  },
  editor: {
    token: Mock.Random.guid().toLowerCase().replace(/-/g, '')
  }
}

const users = {
  'admin-token': {
    roles: ['adminRole'],
    introduction: '超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: '超级管理员'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: '编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/auth/token',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: '用户名或密码不正确。'
        }
      }

      return {
        code: 200,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/back/user/info',
    type: 'get',
    response: config => {
      const info = users['admin-token']

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: '登录失败，无法获取用户详细信息。'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/auth/logout',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
