<template>
  <mappanel :datawidth="388">
    <div ref="container">
      <div class="panel-heading">
        <div class="panel-title">
          点雨量
        </div>
      </div>
      <div class='div_setting'>
        <div class='div_type' :class="{'hours':type=='hours'}" @click="changeType">
          <span>按日期</span><br><span>按小时</span>
        </div>
        <div style="display:inline-block;vertical-align: top;margin-top: 5px;">
          <label>距当前时间：</label>
          <el-radio-group v-model="days" size="mini" @change="changeDays" v-if="type=='days'">
            <el-radio-button label="1天"></el-radio-button>
            <el-radio-button label="3天"></el-radio-button>
            <el-radio-button label="7天"></el-radio-button>
          </el-radio-group>
          <el-radio-group v-model="hours" size="mini" @change="changeHours" v-else>
            <el-radio-button label="1小时"></el-radio-button>
            <el-radio-button label="3小时"></el-radio-button>
            <el-radio-button label="6小时"></el-radio-button>
          </el-radio-group>
          <br>
          <el-date-picker size="mini" style="width:298px;margin-top:3px;"  ref="picker"
          v-model="datetime" :type="datepickertype" range-separator="-" :format="pickerformat"
          start-placeholder="开始" end-placeholder="结束" align="center" @change="changePicker">
        </el-date-picker>
        </div>
        
      </div>
      <el-table :data="tabledata" border style="width: 100%;" size='mini' :height='appheight-185'>
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="stcd" label="站码" align="center"></el-table-column>
        <el-table-column prop="stnm" label="站名" align="center"></el-table-column>
        <el-table-column prop="sump" label="雨量(mm)" align="center"></el-table-column>
      </el-table>
    </div>
  </mappanel>
</template>

<script>
  import mappanel from "@/components/mappanel"
  import request from '@/util/request'
  import '@/util'
  import { mapGetters } from 'vuex'
  export default {
    name: 'dotrain',
    data() {
      return {
        days:'3天',
        hours:'',
        type:'days',
        start:new Date().addDay(-3).format('yyyy-MM-dd hh:00'),
        end:new Date().format('yyyy-MM-dd hh:00'),
        tabledata:[]
      }
    },
    computed:{
      datepickertype(){
        return this.type == "days" ? "daterange" : "datetimerange"
      },
      datetime:{
        get(){
          return [new Date(this.start),new Date(this.end)]
        },
        set(v){
          this.start=v[0].format('yyyy-MM-dd hh:00')
          this.end=v[1].format('yyyy-MM-dd hh:00')
        }
      },
      pickerformat(){
        return this.type == "days" ? "yyyy-MM-dd" : "yyyy-MM-dd HH"
      },
      ...mapGetters(['appheight'])
    },
    components: {
      mappanel: mappanel
    },
    mounted(){
      this.getdata()
    },
    methods: {
      changeDays(value){
        this.type = "days"
        this.hours = "0"
        let num = -value[0]
        this.start = new Date().addDay(num).format('yyyy-MM-dd')
        this.end = new Date().format('yyyy-MM-dd')
      },
      changeHours(value){
        this.type = "hours"
        this.days="0"
        let num = -value[0]
        this.start = new Date().addHour(num).format('yyyy-MM-dd hh:00')
        this.end = new Date().format('yyyy-MM-dd hh:00')
      },
      changeType(){
        setTimeout(()=>{
          if(this.type == "days") {
            this.type = "hours"
          }else{
            this.type = "days"
          }
        },50)
        
      },
      changePicker(value){
        this.hours = this.days = '0'
      },
      getdata(){
        let format = this.type == "days" ? "yyyy-MM-dd 08:00" : "yyyy-MM-dd hh:00"

        let params = {
          tm1 : new Date(this.start).format(format),
          tm2 : new Date(this.end).format(format)
        }

        let url = "/api/sql/getDayRain"
        request.get(url,params).then(response => {
          this.tabledata = response.data
        })
      }
    }
  }
</script>

<style>
.el-time-panel__content::after, .el-time-panel__content::before{margin-top:-6px;}
.el-zoom-in-top-enter-active, .el-zoom-in-top-leave-active{    transition: inherit;}

.panel-heading {
    padding: 5px 10px;
    border-bottom: 1px solid #b7bdc5;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    overflow: hidden;
}
.panel-title {
    display: inline-block;
    color: #3981C0;
    letter-spacing: 2px;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 16px;
}

.div_setting{border-bottom:1px solid silver;white-space: nowrap;}
.div_type{position: relative;height:60px;width:60px;display:inline-block;margin:5px;border:1px solid silver;
border-radius:3px;line-height: 30px;text-align: center;cursor:pointer;}
.div_type span{z-index:1px;position: relative;color:gray;}
.div_type span:first-child{color:white;}
.div_type:before{content:'';position:absolute;width:56px;height:28px;background:#005bac;z-index:0;top:1px;left:1px;
border-radius: 3px;}
.div_type.hours span:first-child {color:gray;}
.div_type.hours span:last-child{color:white;}
.div_type.hours:before{top:inherit;bottom:1px;}
</style>
