# FPGA & IC 创新实验室网站

西安邮电大学 FPGA & IC 创新实验室的任务文档网站，使用 VitePress 构建，由 GitHub Actions 部署到 GitHub Pages。

- 在线访问：<https://xupt-fpga-ic-lab.github.io/>
- 源码仓库：<https://github.com/XUPT-FPGA-IC-Lab/XUPT-FPGA-IC-Lab.github.io>

## 本地运行

需要 Node.js 24（与部署环境一致）和 npm。

```bash
npm ci               # 安装依赖
npm run docs:dev     # 启动本地预览
npm run docs:build   # 构建并检查链接及页面
npm run docs:preview # 预览构建结果
```

## 参与贡献

欢迎补充实验指导、修正文档问题或完善网站功能。

1. 从最新的 `main` 新建分支。
2. 修改内容，并在本地运行 `npm run docs:dev` 预览。
3. 提交前运行 `npm run docs:build`，确认构建通过。
4. 向 `main` 发起 Pull Request，等待构建检查和维护者审核。
5. 合并到 `main` 后会自动部署到 GitHub Pages。

本地运行、写作约定与协作流程见 [CONTRIBUTING.md](CONTRIBUTING.md)。
