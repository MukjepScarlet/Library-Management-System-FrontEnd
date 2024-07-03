# 图书管理系统 (前端部分)

本项目是数据库系统原理课程大作业的一部分, 用于整个系统与各类用户 (含游客/普通用户/管理员等) 的可视化交互.

## 使用说明

- 先安装 Node 环境. 最好使用 LTS 版本 (开发时使用v20.13.1), 并配置好环境变量
- 整个项目通过 `git clone` 等方法下载到本地
- 在终端进入项目文件夹
- 使用 `npm run dev` 启动开发环境, 默认为 `http://localhost:5173`, 参考 [vite.config.ts](./vite.config.ts)
- 打包部署使用 `npm run build`, 输出在 `./dist` 下
- 连接后端: 在 [net.ts](./src/utils/net.ts) 中修改常量 `DOMAIN` (默认为 `http://localhost:8081`)
- 编辑: 使用 [VSCode](https://code.visualstudio.com/) 与 [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) 插件

## 项目介绍

使用到的主要框架/技术:

- [Vite](https://vitejs.dev/)
- [Svelte](https://svelte.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [daisyUI](https://daisyui.com/)
- [ECharts](https://echarts.apache.org/zh/index.html)
