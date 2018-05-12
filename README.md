## vue服务端渲染[博客](http://binlive.cn "博客")，基于nuxt

## 安装

```
 git clone git@github.com:Hzy0913/my-blog.git
```
安装包依赖
```
 npm install
```

## 运行
运行发开环境
```js
npm run dev
```
**本地访问http://localhost:3000**
## 打包部署
tip:生产环境打包需要在服务端进行！
**首先打包编译项目**
```js
npm run build
```
**运行项目**
```js
npm run start
```
**推荐生产环境使用如下命令执行pm2部署**
###### 推荐全局安装pm2
**第一次部署使用firstserver命令**
```js
npm run firstserver
```
**以后每次更新代码执行server命令**
```js
npm run server
```
**暂停服务执行stop命令**
```js
npm run stop
```
**查看服务状态执行list命令**
```js
npm run list
```
该命令会编译打包项目，然后启动一个pm2守护进程服务，具体可见`package`中的npm script
## 项目说明

 - 使用nuxt.js的vue服务端渲染ssr.
 - 使用element-ui 组件库.
 - 使用axios请求库
 - 使用github的Oauth授权登录，评论系统
 - 使用marked解析markdown文档
 - 使用highlight完成代码格式语法高亮

## 在线预览

See [BinLive](http://binlive.cn "BinLive").
## 本地预览
想要在本地开发环境运行完整线上模式，可以转发调用binlive线上环境接口。
修改`nuxt.config.js`文件
```javascript
// 将下面接口调用地址
proxy: [
	['/api', { target: 'http://localhost:3080' }]
]
// 修该成binlive线上地址
proxy: [
	['/api', { target: 'http://binlive.cn:3080' }]
]
```
修改`plugins/axios.js`文件
```javascript
// 将下面接口调用地址
if (process.server) {
  options.baseURL = 'http://localhost:3080'
}
// 修该成binlive线上地址
if (process.server) {
  options.baseURL = 'http://binlive.cn:3080'
}
```
## commit
由于spa对于seo不友好，重构了之前使用vue的spa形式的博客，使用[nuxt.js](https://nuxtjs.org "nuxt.js")
## 博客后端
博客的后端以及后台管理系统项目为[博客后端](https://github.com/Hzy0913/blog-server "博客后端")项目。
