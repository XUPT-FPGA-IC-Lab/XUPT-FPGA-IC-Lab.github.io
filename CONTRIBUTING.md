# 参与贡献

本文档面向需要修改网站内容的实验室成员，包含本地运行、写作约定、提交流程、审核发布和维护职责。

## 本地运行

需要 Node.js 24（与部署环境一致）和 npm。

```bash
npm ci               # 安装依赖
npm run docs:dev     # 启动本地预览
npm run docs:build   # 构建并检查链接及页面
npm run docs:preview # 预览构建结果
```

提交前必须运行 `npm run docs:build`，确认构建通过且没有失效链接。

## 文档与图片约定

- 在线任务放在 `docs/labs/`，并同时在 `docs/labs/index.md` 与 `docs/.vitepress/config.mts` 中增加入口。
- 图片放在任务旁的 `assets/<任务名>/` 目录，使用相对路径，例如：

  ```markdown
  ![VGA 时序示意图](./assets/vga/VGA010_700.png)
  ```

- 从 Obsidian 复制的 `![[图片.png|500]]` 不能直接用于 VitePress。改为标准 Markdown；需要宽度时使用 `<img src="./assets/example.png" alt="图片说明" width="500" />`。文件名带空格时，将 URL 中的空格写为 `%20`。
- 图片必须与 Markdown 一同提交。路径和文件名的大小写必须一致；不要使用电脑上的绝对路径。
- VGA 在线版公式使用 Unicode 文本，避免直接显示未配置渲染器的 LaTeX 标记。
- 每份新任务建议写清学习目标、前置知识、必做与选做、验收标准和参考资料。

## 提交修改

1. 从最新的 `main` 创建分支：

   ```bash
   git switch main
   git pull
   git switch -c docs/your-change
   ```

2. 修改内容，并在本地运行 `npm run docs:dev` 预览。
3. 提交前运行 `npm run docs:build`，确认构建通过、没有失效链接。
4. 推送分支，并向 `main` 发起 Pull Request。
5. PR 会自动运行构建检查（`.github/workflows/build.yml`），不执行部署。
6. 至少一名维护者审核通过后合并。

## 审核要点

- 内容是否与实验室确认的任务要求一致，必做与选做边界是否清楚。
- 新增页面是否已加入 `docs/labs/index.md` 和 `docs/.vitepress/config.mts` 的导航。
- 图片是否随文档一同提交，路径和大小写是否正确。
- 是否引用了未经授权或无法核实来源的图片、文字和外部链接。

## 发布流程

- 合并到 `main` 后，`.github/workflows/deploy.yml` 会自动构建并部署到 GitHub Pages。
- 部署失败时，先在本地运行 `npm run docs:build` 复现问题，修复后再提交。
- 如需回滚，使用 `git revert` 撤销对应提交，由 `main` 重新部署，不要直接修改线上产物。

## 维护职责

- 实验任务正文的最终解释以实验室负责人确认的版本为准。
- 外部参考仓库、镜像地址和第三方资料链接需要指定维护人，并定期检查是否仍可访问。
- 新增或迁移长期使用的实验仓库前，应先确认仓库归属、访问权限和作业提交方式。

## 后续内容建议

优先补充开发环境安装、板卡与引脚约束、仿真入门、常见问题及任务提交说明。
