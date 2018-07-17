<template>
    <div style="padding:10px;" id='menuset'>
        <el-button @click="getMenus" size="mini">刷新</el-button>
        <el-button @click="add" size="mini">添加</el-button>
        <el-button @click="del" size="mini">删除</el-button>
        <el-button @click="test" size="mini">test</el-button>
        <el-table :data="menudata" size="mini" border :height='appheight-115' @cell-click="cellEdit" @keyup.esc.native="cancelEdit"
        highlight-current-row id="menutable" ref="menutable">
            <el-table-column prop="menu_id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="pid" label="PID" width="60" align="center">
                <template slot-scope="scope">
                    <template v-if="scope.row.edit==='pid'">
                        <el-input class="edit-input" size="small" v-model="scope.row.pid" 
                        @keyup.enter.native="saveCell(scope.row,'pid')"></el-input>
                    </template>
                    <span v-else>{{ scope.row.pid }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="名称">
                <template slot-scope="scope">
                    <template v-if="scope.row.edit==='name'">
                        <el-input class="edit-input" size="small" v-model="scope.row.name" autofocus="true" 
                        @keyup.enter.native="saveCell(scope.row,'name')"></el-input>
                    </template>
                    <span v-else>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="path" label="路由">
                <template slot-scope="scope">
                    <template v-if="scope.row.edit==='path'">
                        <el-input class="edit-input" size="small" v-model="scope.row.path" autofocus="true" 
                        @keyup.enter.native="saveCell(scope.row,'path')"></el-input>
                    </template>
                    <span v-else>{{ scope.row.path }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="component" label="组件">
                <template slot-scope="scope">
                    <template v-if="scope.row.edit==='component'">
                        <el-input class="edit-input" size="small" v-model="scope.row.component" autofocus="true" 
                        @keyup.enter.native="saveCell(scope.row,'component')"></el-input>
                    </template>
                    <span v-else>{{ scope.row.component }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" align="center" width='150'>
                <template slot-scope="scope">
                    <template v-if="scope.row.edit==='type'">
                        <el-select v-model="scope.row.type" placeholder="请选择" size="mini" @keyup.enter.native="saveCell(scope.row,'type')">
                            <el-option v-for="item in menutypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </template>
                    <span v-else>{{ scope.row.type }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="icon" label="图标">
                <template slot-scope="scope">
                    <template v-if="scope.row.edit==='icon'">
                        <el-input class="edit-input" size="small" v-model="scope.row.icon" autofocus="true" 
                        @keyup.enter.native="saveCell(scope.row,'icon')"></el-input>
                    </template>
                    <span v-else>{{ scope.row.icon }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="disabled" label="禁用" align="center" width='70'>
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.disabled" active-color="#13ce66" inactive-color="gray" 
                    @change="saveCell(scope.row,'disabled')" :active-value="1" :inactive-value="0"></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="hidden" label="非菜单" align="center" width='70'>
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.hidden" active-color="#13ce66" inactive-color="gray" 
                    @change="saveCell(scope.row,'hidden')" :active-value="1" :inactive-value="0"></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="redirect" label="跳转">
                <template slot-scope="scope">
                    <template v-if="scope.row.edit==='redirect'">
                        <el-input class="edit-input" size="small" v-model="scope.row.redirect" autofocus="true" 
                        @keyup.enter.native="saveCell(scope.row,'redirect')"></el-input>
                    </template>
                    <span v-else>{{ scope.row.redirect }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="order_num" label="排序" align="center" width='70'>
                <template slot-scope="scope">
                    <template v-if="scope.row.edit==='order_num'">
                        <i class="el-icon-rank my-handle"></i>
                    </template>
                    <span v-else>{{ scope.row.order_num }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import request from '@/util/request'
import { mapGetters } from 'vuex'
import Sortable from 'sortablejs'

const editProperty = ["pid","name"]

export default {
    name:"menuSetting",
    data(){
        return{
            menudata:[],
            currentEditRow:{},
            menutypes:[{
                label:'内置组件',value:100
            },{
                label:'嵌入IFRAME',value:200
            },{
                label:'新标签页',value:300
            }]
        }
    },
    computed:{
        ...mapGetters(['appheight'])
    },
    mounted(){
        this.getMenus()
    },
    methods:{
        test(){
            request.get('/devapi/manapi/getFileApiRouteList').then(r=>{
                console.info(r)
            })
        },
        del(){
            if(this.currentEditRow){
                request.get('/devapi/menu/del',{menuid:this.currentEditRow.menu_id}).then(response=>{
                    this.$message({
                            type:"success",
                            message:"删除成功"
                        })  
                    let top = document.querySelectorAll('#menutable .el-table__body-wrapper')[0].scrollTop
                    this.getMenus().then(()=>{
                        document.querySelectorAll('#menutable .el-table__body-wrapper')[0].scrollTop=top
                    })
                })
            }
        },
        add(){
            request.get('/devapi/menu/addEmpty').then(response => {
                this.$message({
                            type:"success",
                            message:"已创建新菜单项，请重新编辑菜单详细信息"
                        })  
                this.getMenus().then(r =>{
                    let lastrow = r[r.length-1]
                    this.$refs.menutable.setCurrentRow(lastrow)
                    document.querySelectorAll('#menutable .el-table__body-wrapper')[0].scrollTop=1000000 
                })
            })
        },
        getMenus(){
            return request.get('/devapi/menu/getMenus').then(response => {
                response.forEach(o=>{
                    o.edit=""
                    editProperty.map(p=>o["old_"+p]=o[p])
                })
                this.menudata = response
                this.$nextTick(() => {
                    if(this.sortable) this.sortable.destroy()
                    this.setSort()
                })
                return this.menudata
            })
        },
        setSort(){
            const el = document.querySelectorAll('#menutable .el-table__body-wrapper > table > tbody')[0]
            this.sortable = Sortable.create(el, {
                handle: ".my-handle",
                ghostClass: 'sortable-ghost',
                setData: function(dataTransfer) {
                    dataTransfer.setData('Text', '')
                },
                onEnd: evt => {
                    
                    let xia = evt.item.nextElementSibling ? +evt.item.nextElementSibling.lastElementChild.innerText : 0
                    let shang = evt.item.previousElementSibling ? +evt.item.previousElementSibling.lastElementChild.innerText : 0
                    let now
                    if(xia && shang) now = (xia+shang)/2
                    else if(xia==0) now = shang+1
                    else if(shang==0) now = xia-1
                    this.currentEditRow.order_num = now
                    let promise = this.saveCell(this.currentEditRow,"order_num")
                    if(promise) promise.then(()=>{
                        
                        this.menudata=[]
                        this.getMenus()
                    })
                    //const targetRow = this.menudata.splice(evt.oldIndex, 1)[0]
                    //this.menudata.splice(evt.newIndex, 0, targetRow)
                    console.info(this.menudata)
                    
                    //setTimeout(()=>{
                        //this.$refs.menutable.doLayout()
                    //},2000)
                }
            })
        },
        cellEdit(row, column, cell, event){
            this.currentEditRow.edit = ""
            row.edit = column.property
            this.currentEditRow = row
        },
        saveCell(row,property,$event){
            if(row[property] != row["old_" + property]){
                var params = {
                    menuid:row.menu_id,
                    property:property,
                    value:row[property]
                }
                return request.get("/devapi/menu/saveMenuCell",params).then(response=>{
                    if(response.success){
                        this.$message({
                            type:"success",
                            message:response.message
                        })
                        row['old_'+property] = row[property]
                        this.currentEditRow.edit = ""
                    }else{
                        this.$message({
                            message:response.message,
                            type:"error"
                        })
                    }
                })
            }
        },
        cancelEdit(){
            this.currentEditRow.edit = ""
        }
    }
}
</script>
<style>
#menuset td{padding:0 !important;height:33px;}
#menuset td .cell{padding:0;}
</style>

<style scoped>
#menutable tr.current-row>td{
    background-color: #c4ffc6;
}

.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #f5bc52!important;
}
</style>
