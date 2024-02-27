# cli-starter

基于 `unbuild` 的脚手架

#### 脚本说明

```json
"scripts": {
	"dev": "本地开发",
	"build": "本地构建",
	"prepublishOnly": "发布 npm package 钩子，触发一次构建",
	"typecheck": "ts check"
},
```

#### 目录结构

告诉 package.json,我的 bin 叫 q-cli,它可执行的文件路径是 bin/q-cli.js

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
