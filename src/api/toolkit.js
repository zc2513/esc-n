const tools = {
  isPhoneInspect: isPhoneInspect,
  orderCodeInspect: orderCodeInspect,
  isWrokTelephone: isWrokTelephone,
  isIDcard: isIDcard,
  isNumber: isNumber,
  isChinese: isChinese,
  ajax: ajax,
  dateFormat: dateFormat,
  getBrowserInfo: getBrowserInfo,
  getUrl: getUrl,
  isChineseName: isChineseName,
  timeVerification: timeVerification
};
function isPhoneInspect(params) {
  var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
  var tel = /([0-9]{3,4}-)?[0-9]{7,8}/;
  // var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  var num = params.substr(0,1);
  if (num != 0 ) {
    if (mobile.test(params)) {
      return 1;
    }else {
      return "手机号格式不正确";
    }
  }else {
    if (params.indexOf("-") != -1) {
      if (tel.test(params)) {
        return 1;
      }else {
        return "固话格式不正确";
      }
    } else {
      return "请在区号后加(-)"
    }
  }
}
function orderCodeInspect(params) {}
//
function isIDcard(sId) {
  var aCity = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外"
  };
  var iSum = 0
  var info = ""
  if (!/^\d{17}(\d|x)$/i.test(sId))
    return false;
  sId = sId.replace(/x$/i, "a");
  if (aCity[parseInt(sId.substr(0, 2))] == null)
    return false;
  var sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
  var d = new Date(sBirthday.replace(/-/g, "/"))
  if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()))
    return false;
  for (var i = 17; i >= 0; i--)
    iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11)
  if (iSum % 11 != 1)
    return false;

  // return aCity[parseInt(sId.substr(0, 2))] + "," + sBirthday + "," + (sId.substr(16, 1) % 2 ? "男" : "女")
  return true;
}
function isWrokTelephone(params) {
  var mobile = /^1[3|5|8]\d{9}$/;
  if (!mobile.test(params)) {
    return false;
  } else {
    return true;
  }
}
function isNumber(params) {
  var reg = new RegExp("^[0-9]*$");
  if (!reg.test(params)) {
    return false;
  } else {
    return true;
  }
}

function isChineseName(paramName) {
  var nameReg = new RegExp("^[\u4E00-\u9FA5]{2,9}$");
  if (nameReg.test(paramName)) {
    return true;
  } else {
    return false;
  }
}

function isChinese(param) {
  var chineseReg = /^[a-z0-9]+$/i;
  if (chineseReg.test(param)) {
    return false;
  } else {
    return true;
  }
}

function ajax() {
  var ajaxData = {
    type: arguments[0].type || "GET",
    url: arguments[0].url || "",
    async: arguments[0].async || "true",
    data: arguments[0].data || null,
    dataType: arguments[0].dataType || "text",
    contentType:
      arguments[0].contentType || "application/x-www-form-urlencoded",
    beforeSend: arguments[0].beforeSend || function() {},
    success: arguments[0].success || function() {},
    error: arguments[0].error || function() {}
  };
  ajaxData.beforeSend();
  var xhr = createxmlHttpRequest();
  xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
  xhr.setRequestHeader("Content-Type", ajaxData.contentType);
  xhr.send(convertData(ajaxData.data));
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        ajaxData.success(xhr.response);
      } else {
        ajaxData.error();
      }
    }
  };
}

function createxmlHttpRequest() {
  if (window.ActiveXObject) {
    return new ActiveXObject("Microsoft.XMLHTTP");
  } else if (window.XMLHttpRequest) {
    return new XMLHttpRequest();
  }
}

function convertData(data) {
  if (typeof data === "object") {
    var convertResult = "";
    for (var c in data) {
      convertResult += c + "=" + data[c] + "&";
    }
    convertResult = convertResult.substring(0, convertResult.length - 1);
    return convertResult;
  } else {
    return data;
  }
}

function dateFormat(timestamp) {
  let dateTime = new Date(timestamp);
  let Y, M, D;
  Y = dateTime.getFullYear() + "-";
  M = (dateTime.getMonth() + 1 < 10 ? "0" + (dateTime.getMonth() + 1) : dateTime.getMonth() + 1) + "-";
  D = dateTime.getDate() + 1 < 10 ? "0" + dateTime.getDate() : dateTime.getDate();
  return Y + M + D;
}

function getBrowserInfo() {
  var ua = navigator.userAgent.toLocaleLowerCase();
  var browserType = null;
  var browserVersion;
  if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
    browserType = "IE";
    browserVersion =
      ua.match(/msie ([\d.]+)/) != null
        ? ua.match(/msie ([\d.]+)/)[1]
        : ua.match(/rv:([\d.]+)/)[1];
  }
  return browserType;
}

function getUrl(key) {
  var keyList = [];
  var valueList = [];
  var hrefStr = decodeURIComponent(window.location.href).replace("#/", "");
  var strArray = hrefStr.split("?");
  var paramStr = strArray[1];
  if (paramStr !== undefined) {
    if (strArray !== null && paramStr !== null) {
      var paramArray = paramStr.split("&");
      for (var i = 0; i < paramArray.length; i++) {
        var param = paramArray[i];
        valueList.push(param.substr(param.indexOf("=") + 1));
        keyList.push(param.substr(0, param.indexOf("=")));
      }
      for (var j = 0; j < keyList.length; j++) {
        if (key == keyList[j]) {
          return valueList[j];
        }
      }
    }
  } else {
    return "";
  }
}

function timeVerification(beginTime,endTime) {
  if ((beginTime && endTime)) {
    var now = Date.parse(new Date(beginTime.substring(0,10)));
    var now1 = Date.parse(new Date(endTime.substring(0,10)));
    var time = Math.floor((now1 - now) / 86400000);
    if (time < 0) {
      return "选择结束时间大于开始时间";
    } else {
      return 1;
    }
  } else {
    return 1;
  }
  
}
export default tools;
