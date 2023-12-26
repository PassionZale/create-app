import fs from "node:fs";
import path from "node:path";
import minimist from "minimist";

async function init() {
  // 解析参数
  const argv = minimist<{ t?: string; template?: string }>(
    process.argv.slice(2)
  );

  // 目标目录名称，默认为 create-app
  const targetDir = argv._[0] || "create-app";

  const cwd = process.cwd();

  // 根路径
  const root = path.join(cwd, targetDir);

  // 模板名称
  const templateName = argv.t || argv.template;

  // 若根路径已经存在，则停止脚本
  if (!isDirectoryEmpty(root))
    throw new Error(
      `${targetDir === "." ? "当前目录" : targetDir + " "}已存在`
    );

  // 将 template- 开头的目录名转换为数组
  const TEMPLATES = fs
    .readdirSync(new URL("..", import.meta.url), { withFileTypes: true })

    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((folder) => folder.match(/^template-.*/));

  if (templateName) {
    if (!TEMPLATES.find((item) => item === `template-${templateName}`)) {
      throw new Error(`模板：${templateName} 不存在`);
    }
  }
}

/** ======== 工具函数 ======== */

function isDirectoryEmpty(directoryPath: string) {
  try {
    const files = fs.readdirSync(directoryPath);
    return files.length === 0 || (files.length === 1 && files[0] === ".git");
  } catch (error) {
    return true;
  }
}

function getProjectName(targetDir: string) {
  return targetDir === "." ? path.basename(path.resolve()) : targetDir;
}

init().catch((error) => console.error(error));
