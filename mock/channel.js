import Mock from 'mockjs'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: Mock.Random.guid().toLowerCase().replace(/-/g, ''),
    channelNm: '@first',
    contacts: '@first',
    contactsTel: '@integer',
    contactsEmail: '@email',
    addrCountry: '86',
    addrProvince: '110000',
    addrCity: '110100',
    addrArea: '110101',
    addrStreet: '@title(5, 10)',
    addrDetail: '@title(10, 15)',
    sales: '@integer',
    salesName: '@first',
    'status|1': ['1', '2'],
    'statusText|1': ['进行中', '已关闭']
  }))
}

export default [
  {
    url: '/web-data/channel/getTableByCondition',
    type: 'post',
    response: config => {
      const { importance, type, channelNm, pageNo = 1, pageSize = 10, sort } = config.body

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (channelNm && item.channelNm.indexOf(channelNm) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1))

      return {
        code: 200,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/web-data/channel/addChannel',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        message: '添加成功',
        data: 'success'
      }
    }
  },

  {
    url: '/web-data/channel/editChannel',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        message: '编辑成功',
        data: 'success'
      }
    }
  },

  {
    url: '/web-data/channel/delChannel',
    type: 'get',
    response: {
      code: 200,
      message: '删除成功',
      data: 'success'
    }
  },

  {
    url: '/web-data/channel/changeChannelStatus',
    type: 'post',
    response: {
      code: 200,
      message: '状态修改成功',
      data: 'success'
    }
  },

  {
    url: '/web-data/channel/findById',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const channel of List) {
        if (channel.id === id) {
          return {
            code: 200,
            data: channel
          }
        }
      }
    }
  },

  {
    url: '/web-data/channel/findAllChannel',
    type: 'get',
    response: {
      code: 200,
      message: '正常',
      data: [{
        'id': '8dd708b691e749bba6922943ccf39018',
        'channelNm': 'qudao1'
      },
      {
        'id': 'd155254c149e4a8dad6b319a9b14ba46',
        'channelNm': 'qudao2'
      }]
    }
  },

  {
    url: '/web-data/channel/findChannelByChannelNameAndUserId',
    type: 'post',
    response: {
      code: 200,
      message: '正常',
      data: [{
        'id': '7dd708b691e749bba6922943ccf39018',
        'name': 'qudao1'
      },
      {
        'id': 'd255254c149e4a8dad6b319a9b14ba46',
        'name': 'qudao2'
      }]
    }
  },

  {
    url: '/web-data/channelAndDistributor/selectByView',
    type: 'get',
    response: {
      code: 200,
      message: '正常',
      data: [{
        'id': '8dd708b691e749bba6922943ccf39018',
        'name': 'qudao测试1'
      },
      {
        'id': 'd155254c149e4a8dad6b319a9b14ba46',
        'name': 'qudao测试2'
      }]
    }
  }
]
