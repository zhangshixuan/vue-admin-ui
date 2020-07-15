import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/web-data/channel/getTableByCondition',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/web-data/channel/addChannel',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/web-data/channel/editChannel',
    method: 'post',
    data
  })
}

export function remove(id) {
  return request({
    url: `/web-data/channel/delChannel`,
    method: 'get',
    params: { id: id }
  })
}

export function changeChannelStatus(data) {
  return request({
    url: `/web-data/channel/changeChannelStatus`,
    method: 'post',
    data
  })
}

export function findById(query) {
  return request({
    url: `/web-data/channel/findById`,
    method: 'get',
    params: query
  })
}

export function findAllChannel() {
  return request({
    url: `/web-data/channel/findAllChannel`,
    method: 'get'
  })
}

export function findChannelByName(data) {
  return request({
    url: `/web-data/channel/findChannelByChannelNameAndUserId`,
    method: 'post',
    data
  })
}

export function selectByView(query) {
  return request({
    url: `/web-data/channelAndDistributor/selectByView`,
    method: 'get',
    params: query
  })
}
