<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.channelNm" placeholder="渠道名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="sales" multiple placeholder="销售负责人" style="width:400px">
        <el-option
          v-for="item in saleList"
          :key="item.id"
          :label="item.username"
          :value="item.id"
        >
          <span v-text="item.username" />
        </el-option>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter()">查询</el-button>
      <router-link :to="'/basic/channel/create'">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus">新增</el-button>
      </router-link>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="渠道名称">
        <template slot-scope="scope">
          <span v-text="scope.row.channelNm" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="销售负责人">
        <template slot-scope="scope">
          <span v-text="scope.row.salesName" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status=='1'">{{ scope.row.statusText }}</el-tag>
          <el-tag v-if="scope.row.status=='2'" type="info">{{ scope.row.statusText }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.status=='1'" type="info" size="mini" @click="changeStatus(row,$index,2)">关闭</el-button>
          <el-button v-if="row.status=='2'" type="primary" size="mini" @click="changeStatus(row,$index,1)">启用</el-button>
          <router-link :to="'/basic/channel/edit/'+row.id">
            <el-button type="primary" size="mini">修改</el-button>
          </router-link>
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            @onConfirm="handleDelete(row,$index)"
          >
            <el-button v-if="row.status!='deleted'" slot="reference" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, remove, changeChannelStatus } from '@/api/channel'
// import { getAllSalesPerson } from '@/api/sales'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'ChannelManager',
  directives: { waves },
  components: { Pagination },
  filters: {
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      saleList: [],
      sales: [],
      listQuery: {
        pageNo: 1,
        pageSize: parseInt(process.env.VUE_APP_PGNO),
        channelNm: '',
        salesId: ''
      }
    }
  },
  created() {
    // this.getSales()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.salesId = this.sales.toString()
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // getSales() {
    //   getAllSalesPerson().then(response => {
    //     this.saleList = response.data
    //   })
    // },
    handleDelete(row, index) {
      remove(row.id).then(response => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })

      this.list.splice(index, 1)
    },
    changeStatus(row, index, sts) {
      const data = {
        id: row.id,
        status: sts
      }
      changeChannelStatus(data).then(response => {
        this.$notify({
          title: '成功',
          message: '状态修改成功',
          type: 'success',
          duration: 2000
        })
        this.listQuery.pageNo = 1
        this.getList()
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    }
  }
}
</script>

