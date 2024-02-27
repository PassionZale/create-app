import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import minimist from "minimist";
import prompts from "prompts";

// 解析参数
const argv = minimist(process.argv.slice(2));

// 目标目录名称，默认为“当前目录”
const targetDir = formatTargetDir(argv._[0]) || ".";

// workspace
const cwd = process.cwd();

// 根路径
const root = path.join(cwd, targetDir);

const renameFiles: Record<string, string | undefined> = {
  _gitignore: ".gitignore",
};

async function init() {
  // 目录非空校验
  if (!isDirectoryEmpty(root))
    throw new Error(
      `${targetDir === "." ? "当前目录" : targetDir + " "}不是一个空目录`
    );

  // 组装 prompts select options
  const TEMPLATES = fs
    .readdirSync(new URL("..", import.meta.url), { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((folder) => folder.match(/^template-.*/))
    .map((folder) => {
      const dir = fileURLToPath(new URL(`../${folder}`, import.meta.url));

      const content = JSON.parse(
        fs.readFileSync(path.join(dir, "package.json"), "utf-8")
      );

      return {
        folder,
        dir,
        content,
      };
    });

  const { templateDir } = await prompts([
    {
      type: "select",
      name: "templateDir",
      message: "请选择一个模板",
      choices: TEMPLATES.map(({ folder, dir, content: { description } }) => ({
        title: folder,
        value: dir,
        description,
      })),
    },
  ]);

  if (templateDir) {
    const write = (file: string, content?: string) => {
      const targetPath = path.join(root, renameFiles[file] ?? file);
      if (content) {
        fs.writeFileSync(targetPath, content);
      } else {
        copy(path.join(templateDir, file), targetPath);
      }
    };

    // 创建目录
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root, { recursive: true });
    }

    // 将模板文件写入目标目录
    const files = fs.readdirSync(templateDir);

    for (const file of files.filter((item) => item !== "package.json")) {
      write(file);
    }

    // 将 package.json 中的 name 替换为指定的项目名称
    const templateInfo = TEMPLATES.find(({ dir }) => dir === templateDir);

    const pkg = templateInfo!.content;

    pkg.name = getProjectName();

    write("package.json", JSON.stringify(pkg, null, 2) + "\n");

    // 项目创建完毕
    console.log(`${pkg.name} created successful`);

    if (root !== cwd) {
      console.log(`  cd ${path.relative(cwd, root)}`);
    }

    console.log(`  npm install`);
    console.log(`  npm run dev`);
    console.log();
  }
}

/** ======== 工具函数 ======== */

function formatTargetDir(targetDir?: string) {
  return targetDir?.trim().replace(/\/+$/g, "");
}

function isDirectoryEmpty(directoryPath: string) {
  try {
    const files = fs.readdirSync(directoryPath);
    return files.length === 0 || (files.length === 1 && files[0] === ".git");
  } catch (error) {
    return true;
  }
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

function getProjectName() {
  return targetDir === "." ? path.basename(path.resolve()) : targetDir;
}

init().catch((error) => console.error(error));
