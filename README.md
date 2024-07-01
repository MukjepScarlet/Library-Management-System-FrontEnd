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

采用 SPA (单页应用) 构建, 可以方便地修改并部署使用.

## 项目设计

### UI 设计

以下各部分均位于 [App.svelte](./src/App.svelte) (程序入口组件) 中.

#### 三大主要部分

- **侧边栏**: 主要导航;
- **顶栏**: 次要导航与用户功能入口;
- **内容**: 表格和卡片等各种内容, 即路由的位置.

其中侧边栏利用 TailwindCSS 的响应式布局, 在屏幕宽度不足时自动收起, 可以按需展开.

#### 其他次要部分

- **提示**: 通用的提示模块, 位于屏幕顶端中央, 醒目地提示用户;
- **弹窗**: HTML 原生的弹窗元素 (`dialog`) 包装而成, 泛用性强.

### 代码组织

采用组件化设计, 尽量提高代码复用率, 节约开发成本.

#### 源代码文件结构与解释

以下, 粗体为文件夹, 斜体为文件 (不含后缀名).

- **components**: 表格/侧边栏/顶栏/提示等各类独立的组件, 不直接参与路由, 而是包含在其他组件中参与.
  - **base**: 更次一级的组件, 包含在上一级组件中.
    - *DateInput*: 日期输入组件, 用于更新/插入数据.
    - *DateTimeInput*: 日期时间输入组件, 用于更新/插入数据.
    - *Dialog*: 最基本的弹窗, 包含一个关闭按钮和一些[插槽](https://svelte.dev/examples/slots).
    - *EditDialog*: 数据输入弹窗, 用于更新/插入数据.
  - *Alerts*: 提示组件.
  - *Header*: 顶栏组件.
  - *RowDetails*: 展示一行数据具体情况使用的组件.
  - *Sidebar*: 侧边栏组件.
  - *Table*: 通用表格组件.
  - *UserEditDialog*: 用户修改自身信息的弹窗.
- **utils**: 存放各类 TypeScript 文件.
  - **extensions**: 各类[拓展函数](https://www.w3schools.com/js/js_object_prototypes.asp).
  - *alert*: **提示**对应的功能, 包含发送成功/错误/警告等各类提示等.
  - *db*: 主要定义与数据库交互使用的类型和接口.
  - *net*: 与后端交互使用的函数封装.
  - *tables*: 使用到的 SQL 表的 TypeScript 定义 (基于 *db*).
  - *user*: 控制全局的用户登录退出.
  - *utils*: 其他工具函数/状态量等.
- **routes**: 具体的路由文件, 其中的每一个 `.svelte` 文件都对应了一个或多个路由.
  - **general**: 不登录也可以使用的功能, 对应 UI 中的 "通用" 一栏.
    - *BooksGallery*: 提供借书功能.
    - *General*: 通用的阅览组件, 展示与否关联到 *tables*. 使用[动态路由](https://github.com/ItalyPaleAle/svelte-spa-router/blob/main/examples/basic-routing/src/routes.js).
  - **personal**: 与用户相关, 个人使用的功能, 对应 UI 中的 "个人" 一栏.
    - *Login*: 登录组件 (卡片).
    - *Register*: 注册组件 (卡片).
    - *MyBorrow*: 用户自己的借阅信息.
  - **management**: 管理员才能使用的功能, 对应 UI 中的 "管理" 一栏.
    - *Management*: 通用的管理组件, 展示与否关联到 *tables*. 使用[动态路由](https://github.com/ItalyPaleAle/svelte-spa-router/blob/main/examples/basic-routing/src/routes.js).
  - *Index*: 主页, 包含了一些卡片, 展示公告和一些图表.
