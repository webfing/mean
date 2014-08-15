# MEAN开发、测试及布署工作流

@(temp)[mean, javascript fullstack]

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