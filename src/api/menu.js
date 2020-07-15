import request from '@/utils/request'

export function getAuthMenu() {
  return request({
    url: '/back/menu/listUserMenu',
    method: 'get'
  })
}
