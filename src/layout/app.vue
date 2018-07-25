<template>
    <el-container class="appcontainer">
      <el-aside :style="sidestyle" id='leftside'>
        <el-scrollbar>
        <div id='logo'>
          <iconfont name="icon-htwater" style="width:40px;height:40px;"></iconfont><span>{{title}}</span>
        </div>
        <appmenu :menuexpand="menuexpand"></appmenu>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <el-header>
          <i class="el-icon-d-arrow-left menu_onoff" :class="{'menu_off':!menuexpand}" @click="toggle" title="展开/折叠"></i>
            <el-breadcrumb class="app-breadcrumb" separator="/">
              <transition-group name="breadcrumb">
                <el-breadcrumb-item v-for="(item,index)  in breadlist" :key="item.path">
                  <span v-if="item.redirect==='noredirect'||index==breadlist.length-1" class="no-redirect">{{item.name}}</span>
                  <router-link v-else :to="item.redirect||item.path">{{item.name}}</router-link>
                </el-breadcrumb-item>
              </transition-group>
            </el-breadcrumb>
          <div id="topright">您好{{user.realname}}，<span @click="logout">退出</span></div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
  import menu from './menu/menu.vue'
  import request from '@/util/request'
  import {title} from '../../static/config'
  import iconfont from '@/components/iconfont'
  export default {
    name: 'index_page',
    components:{
      iconfont,
      appmenu: menu
    },
    data() {
      return {
        title,
        user: {},
        menuexpand:true,
        breadlist:null
      }
    },
    computed:{
      sidestyle(){
        return {width:this.menuexpand?"200px":"64px"}
      }
    },
    watch:{
      $route() {
        this.getBreadlist()
      }
    },
    mounted() {
      request.get('/api/user/current').then(response => {
        this.user = response
      })
      this.reHeight()
      window.onresize =()=>{
        this.reHeight()
      }
      this.getBreadlist()
    },
    methods:{
      getBreadlist(){
        this.breadlist = this.$route.matched.filter(item => item.name)
      },
      toggle(){
        this.menuexpand = !this.menuexpand
      },
      logout() {
        this.$cookies.remove('token')
        this.$router.push({
          path: "/login"
        })
      },
      reHeight() {
        this.$nextTick(() => {
                var el = document.getElementById("app")
        if(el) this.$store.dispatch("reAppHeight",el.offsetHeight)
            });
        
      }
    }
  }
</script>

<style>
  * {
    box-sizing: border-box;
  }
  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
  #app{
    height:100%;
  }
  .appcontainer{height:100%;}
  .el-aside{
    background: rgb(48, 65, 86);
    height: 100%;
    overflow: hidden;
    transition:width 0.4s;
  }
  #leftside .el-scrollbar{height:100%;}
    
  #leftside .el-scrollbar__wrap{
overflow-x: hidden;
  }
  .el-header {
    height: 50px !important;
    background: rgb(255, 255, 255);;
    line-height: 50px;
    padding: 0;
    border-bottom:1px solid rgb(230, 230, 230);
  }
  .el-header>* {
    float: left;
    vertical-align: middle;
  }
  .el-header i.menu_onoff{
    cursor:pointer;
    line-height:inherit;
    margin-left:6px;
    transition:transform 0.4s ease-in;
  }
  .el-header i.menu_onoff.menu_off{
    transform:rotateZ(180deg)
  }
  .el-breadcrumb{
    line-height: inherit;
    margin-left:20px;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    padding: 0;
    height:100%;
  }
  #logo {
    width: 200px;
    height: 50px;
    background: rgb(31, 45, 61);
    color:#84c0ff;padding-left:10px;
  }
   #logo *{
     vertical-align: middle;margin-top: 5px;
   }
   #logo span{
     margin-left:15px;font-size:18px;letter-spacing: 3px;font-weight: bold;
   }
  #topright {
    float: right;
    margin-right: 10px;
  }
  #topright span {
    cursor: pointer;
    color: blue;
  }

  .breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all .5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all .5s;
}

.breadcrumb-leave-active {
  position: absolute;
}

</style>
