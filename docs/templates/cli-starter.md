# cli-starter

基于 `unbuild` 的脚手架模板

#### 快速开始

当你选择 `template-cli` 来创建应用之后，你会得到一个下方举例的 [目录结构](#目录结构)。

```shell
npm create @whouu/app create-cli-app

# 选择 template-cli

cd create-cli-app

npm install

npm run dev

node index.js app-sample

# 内置了 template-sample 模板
# 选择 template-sample 后会创建 app-sample 应用
# 后续你可以在根目录参考 template-sample/ 新增 template-*/ 制作自己的模板
```

> 如果你只是本地玩一下，可以跳过下面的内容，从 [目录结构](#目录结构) 继续阅读，
>
> 如果你准备打包并发布到公服或者私服，请继续浏览下方内容。

**`<project-name>`** 建议按照 `create-*` 的格式定义，例如：`create-cli-app`。

应用创建完毕后， `package.json` 里面的 `name` 和 `bin` 如下所示：

```json
{
  "name": "create-cli-app",
  "bin": "index.js",
  "private": true
}
```

在 `create-cli-app/` 根路径下执行：

```shell
# 打包 package
npm run build

# 新增本地软连接
# 你会得到一个全局的命令 create-cli-app
npm link

# 验证 bin 是否生效
# /usr/local/bin/create-cli-app
which create-cli-app

# 使用 bin 创建应用
create-cli-app app-sample

# 删除本地软连接
npm unlink -g create-cli-app

# 将 package.json 中的 private: true 改成 false
# 执行 npm publish 即可发布到公服
# 若没有登录过公服，需要先执行 npm login
# 若公服上已经存在同名的库，则会发布失败
npm publish --registry https://registry.npmjs.org

# 发布成功后，验证是否成功
# 换一个其他目录
cd ..

# 全局安装刚才发布的 create-cli-app
# 由于我们的命名方式 create-*
# 安装并使用 create-cli-app 现在支持多种方法：

# 方法一. npx
npx create-cli-app <project-name>
# 方法二. npm
npm create cli-app <project-name>
# 方法三. yarn
yarn create cli-app <project-name>
# 方法四. pnpm
pnpm create cli-app <project-name>
# 方法五. cli
npm i -g create-cli-app
create-cli-app <project-name>
```

由于 `packageName` 很容易重名，所以通常会使用 `scoped` 的方式来命名 `packageName`，

在使用 `scoped` 的方式，会与上述的方法有一些区别：

- 命名方式：`@scoped/create-*`
- 发布方式：`npm publish --registry https://registry.npmjs.org --access public`
- 声明方式：
	```json
	# 假定你的包名为：@whouu/create-app
	
	{
		"name": "@whouu/create-app",
		"bin": {
			"create-app": "index.js"
		}
	}
	```
- 使用方式：

	```shell
	# 假定你的包名为：@whouu/create-app

	# 方法一. npx
	npx @whouu/create-app <project-name>
	# 方法二. npm
	npm create @whouu/app <project-name>
	# 方法三. yarn
	yarn create @whouu/app <project-name>
	# 方法四. pnpm
	pnpm create @whouu/app <project-name>
	# 方法五. cli
	npm i -g @whouu/create-app
	create-app <project-name>
	```

> 每次执行 `npm publish` 前需要更改版本号，如果不使用第三方库，例如：[release-it](https://github.com/release-it/release-it)

可以直接使用 `npm version` 来更新：

```shell
npm version [<newversion> | major | minor | patch ]

# 例如：npm version patch
# 会将版本号从 0.0.0 升级到 0.0.1
```

#### 目录结构

```shell
📦template-cli                    # 根目录
 ┣ 📂src
 ┃ ┗ 📜index.ts                   # 脚本源码
 ┣ 📂template-sample              # 模板示例
 ┃ ┣ 📜_gitignore
 ┃ ┗ 📜package.json
 ┣ 📜README.md
 ┣ 📜.gitignore
 ┣ 📜build.config.ts              # unbuild 配置文件
 ┣ 📜index.js                     # bin alias
 ┣ 📜package.json
 ┗ 📜tsconfig.json
```

#### 脚本说明

```json
"scripts": {
	"dev": "本地开发",
	"build": "本地构建",
	"prepublishOnly": "发布 npm package 钩子，触发一次构建",
	"typecheck": "ts check"
},
```

#### 其他

在创建新模板时，`.gitignore` 文件，你需要重命名成 `_gitignore`
