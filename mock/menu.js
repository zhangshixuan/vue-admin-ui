export default [
  {
    url: '/back/menu/listUserMenu',
    type: 'get',
    response: config => {
      return {
        code: 200,
        data: [{
          'id': '0d9c155de8a04c6fb05eb33b0e05a713',
          'title': '麦思系统',
          'code': 'msms',
          'parentId': '-1',
          'url': '',
          'icon': '',
          'orderNum': 0,
          'attr1': '1',
          'children': [{
            'id': '5b2f63f6db8e4e83ade40787f1d62018',
            'title': 'baseInfo',
            'code': 'Ms-baseinfo',
            'parentId': '0d9c155de8a04c6fb05eb33b0e05a713',
            'url': '#',
            'icon': 'clipboard',
            'orderNum': 1,
            'attr1': '1',
            'children': [{
              'id': '4281c041fd9e4ec4b4fcd4b3d19ae759',
              'title': '编辑渠道',
              'code': 'EditChannel',
              'parentId': '5b2f63f6db8e4e83ade40787f1d62018',
              'url': '/basic/channel/edit/:id',
              'icon': '',
              'orderNum': 0,
              'attr1': '2',
              'children': []
            }, {
              'id': '102f423051a7468fb95c3ba457fa81b9',
              'title': '新增渠道',
              'code': 'CreateChannel',
              'parentId': '5b2f63f6db8e4e83ade40787f1d62018',
              'url': '/basic/channel/create',
              'icon': '',
              'orderNum': 0,
              'attr1': '2',
              'children': []
            }, {
              'id': 'ea3b7a7b9d694b1fbc1fd28906495168',
              'title': 'channel',
              'code': 'ChannelManager',
              'parentId': '5b2f63f6db8e4e83ade40787f1d62018',
              'url': '/basic/channel/list',
              'icon': 'list',
              'orderNum': 0,
              'attr1': '1',
              'children': []
            }]
          }]
        }]
      }
    }
  }
]
