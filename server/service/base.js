const {dbs} = require("../helper/dbs")

async function getSqlApiList(){
    var result = null;
    var _getsql = ()=>{
        return new Promise((r1,r2)=>{

            dbs("base").collection("sqlapi").find({}).toArray((e,r)=>{
                if(e){
                    console.error(e);
                }else{
                    result = r;
                    r1();
                }
            });
            return result;
        })
    }
    await _getsql();
    return result;
}

async function getDbList(){
    var result = null;
    var _getsql = ()=>{
        return new Promise((r1,r2)=>{

            dbs("base").collection("dbconfig").find({}).toArray((e,r)=>{
                if(e){
                    console.error(e);
                }else{
                    result = r;
                    r1();
                }
            });
            return result;
        })
    }
    await _getsql();
    return result;
}

async function upsertSqlapi(sqlapi){
    var result = false;
    var addsqlapi = ()=>{
        return new Promise((r1,r2)=>{
            dbs("base").collection("sqlapi").update({methodname:sqlapi.methodname},sqlapi,{upsert:true},function(err,r){
                if(err){
                    console.log("addSqlapi error:"+err);
                    result = false;
                }else{
                    result = true;
                    r1();
                }
            })
        });
    }
    
    await addsqlapi();
    return result;
}

async function deleteSqlapi(p){
    var result = false;
    var del = ()=>{
        return new Promise((r1,r2)=>{
            dbs("base").collection("sqlapi").deleteOne({methodname:p.methodname},function(err,r){
                if(err){
                    console.log("delete sqlapi error:"+err);
                    result = false;
                }else{
                    result = true;
                    r1();
                }
            })
        });
    }
    
    await del();
    return result;
}

module.exports = {
    getSqlApiList,
    getDbList,
    upsertSqlapi,
    deleteSqlapi
}