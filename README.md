
# libchinaidcard

## 特点
- 只有一个文件  
- 体积小  
- API 简洁  

## 安装
- 在你的npm项目目录下执行`npm install libchinaidcard`  

## 使用
### 说明
没有特殊说明，参数 idCard 的长度都应是 17  
除了 isVaild 函数，所有函数都没有错误处理机制，请自行处理错误  
参数 idCard 必须为 String, 传 number 会有精度问题  

### 函数都有啥
- getCheckCode 获取校验码  
- conv15to18 将 15 位身份证转为 18 位  
参数为 15 位的身份证
- isVaild 测试身份证是否有效  
可传入 15 位身份证或 18 位 身份证，但是不能传 17 位身份证
- getBirthYear 获取出生年
- getBirthMonth 获取出生月
- getBirthDay 获取出生日
- getBirthDate 获取出生年月日  
返回类似于 `{year:0,month:0,day:0}`
- getSex 获取性别  
男的返回 `'m'`，女的返回 `'f'`
- parseAreaData 解析行政区划
- getBirthplace 获取出生地  
返回类似于 `{province:'',city:'',district:''}`
- getDetails 获取详细的个人信息  
返回类似于 `{
  year: 0,
  month: 0,
  day: 0,
  sex: '',
  birthplace:''
  }`

## 个人吐槽
对比其它中国身份证解析类的 npm 库了,在我看来  
我看不爽  
然后就写了这个  
生肖 星座 农历 那些真的有必要吗???  
估计很多时候用不到  
年龄也是, 自己获取日期然后算

## 道歉
之前没认真写，所以有的api很烂，在此道歉，bug已经修了

## 注意事项
为了避免不必要的麻烦,在执行其他函数之前,  
请自行确认身份证没问题 (`isVaild()` )  
`xzqh` 是 `行政区划` 的意思, 代码中我统称 `areaData` 了  
部分代码可能读起来会有点吃力, 难受, 那就**多读几遍**  
因为是适配 2020年版（在 2022 年为最新）的行政区划代码，所以换别的我没试过  
发现这个版本中石河子市以及以下比较特殊，所以做了适配
别的地区有没有特殊暂时不知道

## 可能会问的问题
为什么不把 api 放在一个 IDCard 对象的 prototype 中?  
为了减少不必要的麻烦  
  
## 用于测试
手打的，除了测试没有别的意义
15 : `511702800222130`  
18 : `110101190001011009`  

## 相关链接
本库所用的行政区划代码库 [https://www.mca.gov.cn/article/sj/xzqh/2020/20201201.html]()  
行政区划代码列表 [https://www.mca.gov.cn/article/sj/xzqh/]()  
全国行政区划信息查询平台 [http://xzqh.mca.gov.cn/map]()  
身份证校验相关 [https://juejin.cn/post/6925438445871431688]()  