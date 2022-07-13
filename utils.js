function getCheckCode(idCard) {
    idCard = idCard.toString()

    const weightFactor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    const checkCode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    var len = idCard.length
    var num = 0
    for (let i = 0; i < len; i++) {
        num = num + idCard.charAt(i) * weightFactor[i]
    }
    return checkCode[num % 11]
}

function conv15to18(idCard) {
    return idCard.slice(0, 6) + "19" + idCard.slice(6) + getCheckCode(idCard);
}

function isVaild(idCard) {
    // 代码没有任何美感, 但是很硬核

    if (idCard.charAt(0) == '0') {
        return false
    }

    if (idCard.length == 15) {
        if (isNaN(Number(idCard))) {
            return false
        }
        idCard = conv15to18(idCard)
    } else if (idCard.length == 18) {
        if (isNaN(Number(idCard.substring(0, 17)))) {
            return false
        }
        if (getCheckCode(idCard.substring(0, 17)) != idCard.charAt(17)) {
            return false
        }
    } else {
        return false
    }

    var year = Number(idCard.substring(6, 10))
    var month = Number(idCard.substring(10, 12))
    var day = Number(idCard.substring(12, 14))

    var birth = new Date()
    birth.setFullYear(year)
    birth.setMonth(month - 1)
    birth.setDate(day)
    // js特性,传参0就是一月了,传参11就是十二月了

    if (birth.getFullYear() != year || birth.getMonth() + 1 != month || birth.getDate() != day) {
        return false
    }

    return true
}

function getBirthYear(idCard) {
    return Number(idCard.substring(6, 10))
}

function getBirthMonth(idCard) {
    return Number(idCard.substring(10, 12))
}

function getBirthDay(idCard) {
    return Number(idCard.substring(12, 14))
}

function getBirthDate(idCard) {
    return {
        year: Number(idCard.substring(6, 10)),
        month: Number(idCard.substring(10, 12)),
        day: Number(idCard.substring(12, 14))
    }
}

// m 是男, f 是女
function getSex(idCard) {
    return Number(idCard.charAt(16)) % 2 != 0 ? 'm' : 'f'
}

/*
解析前 请把整理成这样
我一般用sublimetext的正则来整理

130000 河北省
130100 石家庄市
130102 长安区
130104 桥西区
130105 新华区
130200 唐山市
130202 路南区
130203 路北区
*/
/*
与 直接解析 相比，解析json 快一倍
当然我电脑是这样

解析json (推荐)
var areaData = require("./xzqh2020.json")

直接解析
var areaData = parseAreaData("./xzqh2020.txt")
*/
function parseAreaData(file) {

    const municipality = ['11', '12', '31', '50']
    // console.time('parseAreaData')
    var list = require("fs").readFileSync(file, "UTF-8").split("\n")
    for (var i in list) {
        list[i] = list[i].split(" ")
        list[i][0] = [list[i][0].substring(0, 2), list[i][0].substring(2, 4), list[i][0].substring(4, 6)]
        list[i][2] = []
    }
    // list 里面长这样 [ [["11","00","00"],"北京市",[...]], ...]

    var tree = [];
    var provinceIndex = 0
    var cityIndex = 0
    for (var i = 0, len = list.length; i < len; i++) {
        if (typeof tree[provinceIndex - 1] == "undefined" || list[i][0][0] != tree[provinceIndex - 1][0][0]) {
            // 不同的省
            tree.push(list[i])
            provinceIndex++
            cityIndex = 0
        } else {
            // 同省,可能是市或区
            //console.log(list[i][1],municipality.indexOf(list[i][0][0])!=-1)
            if (
                typeof tree[provinceIndex - 1][2][cityIndex - 1] == "undefined" ||
                list[i][0][1] != tree[provinceIndex - 1][2][cityIndex - 1][0][1] ||
                municipality.indexOf(list[i][0][0]) != -1 ||
                (list[i][0][0] == "65" && list[i][0][1] == "90") /* 石河子市以及以下比较特殊，它们不在阿勒泰地区，是并列的 */
            ) {
                // 不同的市
                tree[provinceIndex - 1][2].push(list[i])
                cityIndex++
            } else {
                // 同市,都是区
                tree[provinceIndex - 1][2][cityIndex - 1][2].push(list[i])
            }
        }

    }

    // console.timeEnd('parseAreaData')

    // 解析完之后可直接保存文件
    // fs.writeFileSync("xzqh2020.json",JSON.stringify(tree),"UTF-8")
    return tree;
}

// 加载行政区划代码库
const areaData = require("./data/xzqh2020.json")
// const areaData = parseAreaData("./data/xzqh2020.txt")
// require("fs").writeFileSync("xzqh2020.json", JSON.stringify(areaData, null, 4), "UTF-8")

function getBirthplace(idCard) {
    const municipality = ['11', '12', '31', '50']

    var provinceCode = idCard.substring(0, 2)
    var cityCode = idCard.substring(2, 4)
    var districtCode = idCard.substring(4, 6)
    var area = {}
    if (municipality.indexOf(provinceCode) != -1 || (provinceCode == "65" && cityCode == "90")) {
        for (var i in areaData) {
            if (areaData[i][0][0] == provinceCode) {
                area.province = areaData[i][1]
                for (var j in areaData[i][2]) {
                    if (areaData[i][2][j][0][2] == districtCode) {
                        area.city = areaData[i][2][j][1]
                    }
                }
            }
        }
    } else {
        for (var i in areaData) {
            if (areaData[i][0][0] == provinceCode) {
                area.province = areaData[i][1]
                for (var j in areaData[i][2]) {
                    if (areaData[i][2][j][0][1] == cityCode) {
                        area.city = areaData[i][2][j][1]
                        for (var k in areaData[i][2][j][2]) {
                            if (areaData[i][2][j][2][k][0][2] == districtCode) {
                                area.district = areaData[i][2][j][2][k][1]
                            }
                        }
                    }
                }
            }
        }
    }
    return area
}

function getDetails(idCard){
    return {
        year: getBirthYear(idCard),
        month: getBirthMonth(idCard),
        day: getBirthDay(idCard),
        sex: getSex(idCard),
        birthplace: getBirthplace(idCard)
    }
}

// 没错就是这么暴力
module.exports.getCheckCode = getCheckCode
module.exports.conv15to18 = conv15to18
module.exports.isVaild = isVaild
module.exports.getBirthYear = getBirthYear
module.exports.getBirthMonth = getBirthMonth
module.exports.getBirthDay = getBirthDay
module.exports.getBirthDate = getBirthDate
module.exports.getSex = getSex
module.exports.parseAreaData = parseAreaData
module.exports.getBirthplace = getBirthplace
module.exports.getDetails = getDetails