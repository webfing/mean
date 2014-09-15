# MEAN开发、测试及布署工作流

@(temp)[mean, javascript fullstack]

> 在Javascript的开发过程中，经常会遇到一些重复性的任务，比如合并文件、压缩代码、检查语法错误、将Sass代码转成CSS代码等等。通常，我们需要使用不同的工具，来完成不同的任务，既重复劳动又非常耗时。我们亟需一套工程来解决这些人力无法解决的问题。

## 项目初始化
* 安装项目管理工具
	
	npm install -g yo
	

## workflow

### 工具集
* nodejs
* bower
* grunt 
* yeoman

由yo生成器初始化项目结构，npm安装nodejs包，bower安装脚本

### 编辑器

sublime text 巧手
* ctrl+p 调出文件搜索，可以快速打开想要的文件
* ctrl+p 调出文件搜索后，r/u/m可以搜出routes/user/messages.js


让神器更强大：插件

* Git 不解释，很强大，再也不用频繁切换界面
* HTML5 快速生成html5模板，再也不用记忆和手码字了
* Emmet 还记得那些年我们一些tab过的zend coding吗
* jQuery jquery提示
* LESS less语法高亮
* Sass Sass语法高亮
* DocBlockr 注释，不解释
* JsFormat 格式化js，命令为：Format: Javascript，不是jsformat开头
* ColorPicker 颜色拾取器
* Emmet Css Snippets css版zend coding，语法网址： http://p233.github.io/Emmet-Css-Snippets-for-Sublime-Text-2/
* Markdown preview 不解释
* Pretty JSON json美化，有开发格式和压缩格式
* Terminal 在当前项目/当前选中文件所在文件夹打开teminal窗口 ctrl+shift+t
* angularjs 语法提示
* HTML-CSS-JS Prettify 美化集合，命令统一为: htmlprettify
* Bootstrap 3 Snippets bt神器
* Git Gutter 对git状态的支持

### 版本库

* 库初始化
 git init

* 增加新文件，或文件有修改想加入准备列表中
 git add filepath

* 提交并加注释
 git commit -m "message"

* push到线上
 git push 

* 更新线上到当前
 git pull

### 自由冲浪

* 拥有一款稳定vpn非常重要 https://www.51jsq.org/
* sublime text 插件hot排名 https://sublime.wbond.net/
* mongoose文档 http://mongoosejs.com/docs/guide.html
* nodejs文档 http://nodejs.org/api/
* angular文档 https://docs.angularjs.org/api
* yeoman官方安装包列表 http://yeoman.io/generators/official.html
* grunt官方插件下载hot http://gruntjs.com/plugins
* express文档 http://expressjs.com/4x/api.html
* npm包搜索 http://npmsearch.com/
* canimus css3兼容性

##编码

### npm包管理
* 无论是安装还是删除，只有带了`--save`参数才会更新package.json文件
* 带--save会更新到`dependencies`字段，而带--save-dev会更新到`devDependencies`开发版依懒中

#### 版本标识

参考资料：https://www.npmjs.org/doc/misc/semver.html

* "~1.2.3"	=	">=1.2.3 <1.3.0"
* "1.x.x"	=	">=1.0.0 <2.0.0"
* "^1.2.3"	=	">=1.2.3 <2.0.0"
* "*"		=	"任意版本"

### bower插件管理
基础结构与npm包的管理相同，只是在标识版本号上有异，npm是用`@`号来指识版本号，而bower是用`#`来标识的

### grunt常用任务
	
	grunt.registerTask('build', [
	    'clean:dist',		//清除目录
	    'bower-install',	//bower包自动引入	***
	    'useminPrepare',	//准备usemin		*****
	    'concurrent:dist',	//多任务同时走
	    'autoprefixer',		//添加css前缀		***
	    'concat',			//js，css文件合并	****
	    'ngmin',			//angular文件合并	**
	    'copy:dist',		//复制文件			
	    'cdnify',			//cdn替换
	    'cssmin',			//css压缩			****
	    'uglify',			//js压缩			****
	    'rev',				//静态资源版本号	*****
	    'usemin'			//合并，压缩，替换静态资源	*****
	  ]);

* 在对静态资源的处量时，经常要用到合并压缩等动作，会产生很多中间过渡文件，所以一般会创建一个`.tmp`文件夹来暂存

##布署
### CDN使用
* 七牛使用
* 配使测试七牛上传回调，使用百度云
### 云布署

##注意事项
* 百度ueditor在git上的包是没有打包的，用bower下下来之后要用grunt初始化一次
* 百度ueditor初始化之后，修改dist文件夹下的ueditor.config.js文件的上传路径


## 总结思考

### 功能需求

上级传达的需求：
PM：要有管理后台、前台要自适应无线端
PD：使用node.js开发、单人全栈开发

需求理解扩展思路：

* 确定方向：
	使用node.js进行全栈开发，目前成熟的node.js CMS系统不多，而且后台功能点不会太多，所以这里考虑自己写后台，不使用开源CMS系统

* 确定框架：
	* 管理后台
		自己写后台，还要有后台界面，这样会花去很多时间，耽误工期。细心禅悟，后台主要是突出功能，界面可以使用UI框架提高效率，所以管理后台
		的开发选择MEAN开发栈：
		* UI层使用bootstrap
		* 交互层（前端MVVM）使用angular.js
		* 后端MVC使用Express
		* 数据库Mongodb
		* 前后台数据交互使用restful风格
	* 前台
		上面为了开发效率，后台使用了MEAN。但是我们知道MEAN产品不适合前台产品(浏览器兼容性及seo)，这时要为前台选择一套开发方案，思考：
		前后台能否在一个项目中完成？难点有以下几点：
		* 前后台开发模式区别很大，要偶合在一起很难
		* 路由设计不同，MEAN的路由在前端
		* 调用资源不同
		考虑到以上几点，折分前后台，分成两个独立项目，然后分别处理同一数据库。这样在安全性，维护性上都更加方便。
		跟据以上推断，前台是一个独立的项目，前台开发要同时兼顾以下几点：
		* 能自适应各种终端	-> 需要一套适应式方案
		* 保证视觉效果的同时兼容到IE7+ 	-> UI层不能使用bootstrap
		* 保存爬虫能爬取	-> 交互层不能使用angular.js且页面渲染不能由前端完成
		推断出：
		* 前台页面和UI跟据设计稿已经定死了，不需要一套完整的UI框架，只需要轻量级的响应式框架且要支持IE7+，这里我选择了Skeleton
		* 前台交互逻辑不会太复杂，这里选择基于jQuery自己写交互
		* 与后台不同，这里为了seo，页面渲染工作将在后台完成
		所以前台开发框栈：
		* 响应式框架 Skeleton
		* 交互 jQuery
		* 后端相同

* 细节延申
 以上确定了大体的框架，下面思考一下细节问题
 * 新闻管理中需要发布新闻功能，且能够上传图片，封面图需要按比例自动裁切
 * 简历上传中HR希望能够支持上传附件功能，上传在自己的服务器中风险如何评估
 * 站点中有视频，与其它资料从同一服务器下载会阻塞，延长加载时间

考虑xss注入风险及使用方便，富文本编辑器使用百度ueditor编缉器
封面要按比较自动裁切，需要后端有处理图片的库，这里使用七牛的内置的图片处理，方便好用
视频也一并放在七牛中，加快网页打开速度

* 工作流及布署
软件开发中，对程员友好的代码及文件结构自然应该是按功能分模块，既对svn维护时方便，也方便多人同时开发，更方案日后维护。
然而如果是前台产品，一个模块一个文件，http请求很多，影响加载速度，所以一般产品上线前需要合并文件且加密处理。这里就有很多细节问题了：
	* js打包加密，css合并，scss编译，代码清除注释等一系例需要不停切换工具、冗长复杂的工作，人工很难精准完成
	* 为了最大程度使用好浏览器缓存（有很多学问），一般将静态资源过期时间设置最长，
		但是这带来一个问题当页面有更新如何让客户端第一时间使用新的资源？你们平时是如何处理的
		所以这样缓存很多率不高，且在资源分署时会出错。目前比较前沿的处理方案是使用md5对整个文件加密来判断新鲜度
		然而这样人工也是无法维护的
	* javascript包管理，我们知道node.js的第三方包有npm来管理，我们使用就很方便了，但是在使用javascript框方面，是不是有同样问题呢，
	比如我想下个jquery插件，我需要去官网，还得找下载连接，这些过程很麻烦
上面说的一切，人工都没法全部完成，亟需一套完善的工具来解决这种工程性问题：
* yeoman -> 项目初始化脚手架
* grunt	-> 类似于宏
* bower	-> 包管理

如果说ajax给了js第一春，使web page进化到了web app重武器时代；那么node.js则是给了js第二春，从些前端sir大步进军服务端，更重要的是，
node.js突破了js只能在浏览器玩的局限，有了调用os接口的能力，在这之止，延伸出来了很多工程化工具，利用好这些工具，上一节的问题的迎刃而解

* yeoman -> 项目初始化脚手架
* grunt	-> 类似于宏
* bower	-> 包管理