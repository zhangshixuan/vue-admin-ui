import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/token',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/back/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'get'
  })
}
