<template>
  <div id="add-container">
    <el-form ref="postForm" v-loading="loading" :model="postForm" :rules="rules" label-width="120px" style="width:80%;max-width:900px;margin-left:10%;margin-top:20px;">
      <el-row>
        <el-col :span="12">
          <el-form-item label="渠道名称" prop="channelNm">
            <el-input v-model.trim="postForm.channelNm" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销售负责人" prop="salesId">
            <el-select ref="salesName" v-model="postForm.salesId" placeholder="销售负责人" style="width:100%">
              <el-option
                v-for="item in saleList"
                :key="item.id"
                :label="item.username"
                :value="item.id"
              >
                <span v-text="item.username" />
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model.trim="postForm.contacts" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人手机" prop="contactsTel">
            <el-input v-model.trim="postForm.contactsTel" maxlength="11" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人Email" prop="contactsEmail">
            <el-input v-model.trim="postForm.contactsEmail" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人微信号" prop="contactsWX">
            <el-input v-model.trim="postForm.contactsWX" maxlength="20" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="负责人" prop="duty">
            <el-input v-model.trim="postForm.duty" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人联系方式" prop="dutyContacts">
            <el-input v-model.trim="postForm.dutyContacts" maxlength="20" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="渠道省市" prop="addrProvince">
            <el-cascader
              v-model="selectedOptions"
              style="width:100%"
              :options="options"
              :separator="' '"
              clearable
              :props="{ expandTrigger: 'hover' }"
              @change="handleChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="详细地址" prop="addrDetail">
            <el-input v-model.trim="postForm.addrDetail" maxlength="50" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button :disabled="subdisabled" type="primary" @click="onSubmit('postForm')">保存</el-button>
        <el-button @click="resetForm('postForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { findById, create, update } from '@/api/channel'
// import { getAllSalesPerson } from '@/api/sales'
import options from '@/utils/country-data.js'

const defaultForm = {
  id: undefined,
  channelNm: '', // 渠道名称
  contacts: '', // 渠道联系人
  contactsTel: '', // 联系人手机
  contactsEmail: '', // 联系人email
  addrCountry: '86', // 国家
  addrProvince: '', // 省
  addrCity: '', // 市
  addrArea: '', // 区
  addrStreet: '', // 街道
  addrDetail: '', // 详细地址
  contactsWX: '', // 联系人微信
  duty: '', // 负责人姓名
  dutyContacts: '', // 负责人联系方式
  salesId: '', // 销售人id
  salesName: '' // 销售名称
}

export default {
  name: 'ChannelDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      subdisabled: true,
      selectedOptions: [], // 存放默认值
      options: options, // 存放城市数据
      saleList: [],
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        channelNm: [{ required: true, message: '请输入渠道名称', trigger: 'blur' }],
        salesId: [{ required: true, message: '请选择销售负责人', trigger: 'change' }],
        contacts: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        contactsTel: [{ validator: (rule, value, callBack) => {
          if (value.length > 0 && !/^[1][0-9]{10}$/.test(value)) {
            callBack('请输入正确的手机号码')
          } else {
            callBack()
          }
        }, trigger: 'blur' }],
        contactsEmail: [{ type: 'email', message: '请输入合法的Email', trigger: 'blur' }],
        addrProvince: [{ required: true, message: '请选择省市区', trigger: ['blur', 'change'] }],
        addrDetail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  computed: {

  },
  created() {
    // this.getSales()
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }
    this.subdisabled = false
  },
  methods: {
    fetchData(id) {
      findById({ id: id }).then(response => {
        this.postForm = response.data
        this.selectedOptions = [response.data.addrProvince, response.data.addrCity, response.data.addrArea]
      }).catch(err => {
        console.log(err)
      })
    },
    // getSales() {
    //   getAllSalesPerson().then(response => {
    //     this.saleList = response.data
    //   })
    // },
    handleChange(value) {
      if (value.length === 3) {
        this.postForm.addrProvince = value[0]
        this.postForm.addrCity = value[1]
        this.postForm.addrArea = value[2]
      }
    },
    resetSub() {
      var that = this
      setTimeout(() => (that.subdisabled = false), 3000)
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('--dd-')
          if (this.postForm.contactsWX === '' && this.postForm.contactsTel === '') {
            this.$notify({
              title: '提示',
              message: '联系人手机和联系人微信号不能同时为空',
              type: 'info',
              duration: 3000
            })
          } else {
            this.loading = true
            this.subdisabled = true
            this.postForm.salesName = this.$refs.salesName.selectedLabel
            if (this.isEdit) {
              update(this.postForm).then((r) => {
                this.$notify({
                  title: '成功',
                  message: r.message,
                  type: 'success',
                  duration: 2000
                })
                this.loading = false
                this.resetSub()
              }, er => {
                this.loading = false
                this.resetSub()
              })
            } else {
              create(this.postForm).then((r) => {
                this.$notify({
                  title: '成功',
                  message: r.message,
                  type: 'success',
                  duration: 2000
                })
                this.selectedOptions = []
                this.resetForm(formName)
                this.loading = false
                this.resetSub()
              }, er => {
                this.loading = false
                this.resetSub()
              })
            }
          }
        } else {
          console.log('提交出错了!!')
          return false
        }
      })
    },
    resetForm(formName) {
      if (!this.isEdit) {
        this.selectedOptions = []
      }
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
</style>
