<template>
    <el-menu mode="vertical" :collapse="!menuexpand" router :default-active="$route.path">
        <template v-for="item in $router.options.routes" v-if="!item.hidden">
            <el-submenu v-if="item.children&&item.children.length" :index="item.id+''">
                <template slot="title">
                    <svg class="icon" aria-hidden="true">
                        <use :xlink:href="'#'+item.iconCls"></use>
                    </svg>
                    <span>{{item.name}}</span>
                </template>
                <el-menu-item v-for="subitem in item.children" v-if="!subitem.hidden" :key="subitem.id" :index="subitem.path"
                 @mousedown.native="clickMenu($event,subitem)" :class="{'disabled':subitem.disabled}">{{subitem.name}}</el-menu-item>
            </el-submenu>
            <el-menu-item v-else :index="item.path" :key="item.id" @mousedown.native="clickMenu($event,item)">
                <svg class="icon" aria-hidden="true">
                    <use :xlink:href="'#'+item.iconCls"></use>
                </svg>
                <span slot="title">{{item.name}}</span>
            </el-menu-item>
        </template>
    </el-menu>
    
</template>

<script>
    import '@/assets/iconfont'
    export default {
        name: 'menuCom',
        data() {
            return {
                menudata: []
            }
        },
        props:{
            menuexpand:Boolean
        },
        mounted() {},
        methods: {
            clickMenu(event, item) {
                if (item.disabled) {
                    event.stopPropagation();
                    return;
                }
                if (item.type == "300") {
                    event.stopPropagation();
                    window.open(item.component.template);
                }
            }
        }
    }
</script>

<style>
    a {
        text-decoration: none;
    }
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
    .el-menu{
        background-color: transparent;border-right: none;
    }
    .el-menu-item{
        color:white;
        
    }
    .el-menu-item.el-menu-item:focus{
        background: rgb(38,52,69);
    }
    .el-menu-item:hover{
        background: rgb(38,52,69);
    }
    
    .el-submenu__title{
        color:white;
    }
    .el-submenu__title:hover{
        background:  rgb(38,52,69);
    }
    .el-submenu .el-menu{
        background:  rgb(31, 45, 61);
    }
    .el-submenu .el-menu-item:hover{
        background: rgb(0,21,40);
    }
    .el-menu--vertical{background: rgb(48, 65, 86);margin-left:2px;border-radius:3px;}

    .el-menu-item.disabled {
        color: silver;
        cursor:not-allowed;
        pointer-events: none;
    }
    .icon {
        width: 16px;
        height: 16px;
        fill: currentColor;
        overflow: hidden;
    }
    .subicon {
        width: 16px;
        height: 16px;
        display: inline-block;
    }
</style>
