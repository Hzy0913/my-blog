## vue服务端渲染[博客](http://binlive.cn "博客")，基于nuxt

## 安装

```
$ git clone git@github.com:Hzy0913/my-blog.git
```
安装包依赖
```
$ npm install
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
**生产环境使用pm2部署**
全局安装pm2后执行下面命令
```js
npm run server
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

## commit
由于spa对于seo不友好，重构了之前使用vue的spa形式的博客，使用[nuxt.js](https://nuxtjs.org "nuxt.js")
