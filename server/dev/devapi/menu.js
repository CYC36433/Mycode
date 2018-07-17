const { dbs } = require("../../helper/dbs")

async function getMenus(params) {
    var menus = await dbs("base")("sys_menu").orderBy('order_num')
    return menus
}
async function saveMenuCell(params) {
    let target = {}
    target[params.property] = params.value
    let result = await dbs("base")("sys_menu").where("menu_id", "=", params.menuid)
        .update(target, "menu_id")
    if (result) {
        return {
            success: true,
            message: '修改ID为' + params.menuid + '的菜单成功'
        }
    }else{
        return {
            sucess:false,
            message:'菜单修改失败'
        }
    }
}
async function addEmpty(){
    let max = await dbs('base')('sys_menu').max('order_num as max')
    let result = await dbs('base')('sys_menu').returning('menu_id').insert({name:'新菜单项',order_num:max[0].max+100})
    return result
}
async function del(params){
    let result = await dbs('base')('sys_menu').where('menu_id',params.menuid).del()
    return result
}
module.exports = {
    getMenus,
    saveMenuCell,
    addEmpty,
    del
}