Date.prototype.format = function (fmt) { //author: meizz 
    var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1,(this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1,(RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  };
  Date.prototype.addDay = function (days) {
    this.setDate(this.getDate() + days);
    return this;
  };
  Date.prototype.addHour = function (hours) {
    this.setHours(this.getHours() + hours);
    return this;
  };

  Array.prototype.unique = function(){
    var res = [];
    var json = {};
    for(var i = 0; i < this.length; i++){
     if(!json[this[i]]){
      res.push(this[i]);
      json[this[i]] = 1;
     }
    }
    return res;
   }