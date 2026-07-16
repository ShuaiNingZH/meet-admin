## 变更日志

### 0.5.0

_2026-07-16_

#### 重大变化

- 重构项目模板，删除示例业务代码，精简为通用管理后台脚手架
- 重构路由与 axios 请求层，统一请求错误处理并修复重复请求、字段错位等问题
- 删除 `utils`/`hooks`/`stores` 桶文件导出，统一改为深路径导入
- 表格容器类名 `table-main` 更名为 `app-table`，全局间距统一为 4px 网格规范
- 移除旧版命令式弹窗 `addPopup`，改用 [ AppPopup ] 提供的 `openPopup` API
- 删除 [ AppDropdown ] 组件
- `pnpm` 版本要求升级至 `11`，持续升级项目依赖至最新版本

#### 新功能

- 新增用户管理、角色管理、菜单管理页面
- 新增首页数据看板
- 新增 [ AppDrawer ] 抽屉组件，并用其重构系统设置、用户/角色/菜单表单
- [ AppPopup ] 新增命令式调用 API `openPopup` 及宿主组件 `AppPopupHost`
- 新增 `v-auth` 按钮级权限指令，接入 [ AppTable ] 操作列
- [ AppTable ] 新增操作按钮列 `type: operation`
- [ LayHeader ] 新增消息提醒功能，面包屑父级支持下拉切换同级菜单
- 新增 403/500 异常页面，重构 404 页面
- 明暗主题切换新增 View Transition 圆形扩散动画
- [ LaySettings ] 新增下载配置，导出可直接替换的系统默认配置
- [ SearchMenu ] 新增搜索历史与拼音搜索
- 新增关于页面，展示项目信息与生产/开发依赖列表
- 新增 Grid、Popup、Text、Editor、Upload 组件演示页

#### 错误修复

- 修复退出登录时未移除动态路由、菜单状态未重置的问题
- 修复 [ AppEditor ]/[ AppUpload ] 暗色主题适配及上传相关问题
- 修复 [ AppTable ] 操作列按钮 Tab 聚焦高亮边框被裁剪问题
- 修复 `el-dropdown` 菜单占位不够时错位问题
- 修复深色主题下 `echarts` 存在深蓝色背景及图表容器观察问题
- 修复 `useTable`、`useReset` 等 hooks 数据隔离与响应式失效问题
- 修复首屏渲染白色闪烁及 Windows 下 UnoCSS ESLint 插件配置解析问题
- 更换项目 logo

#### 重构

- 重构 [ AppTable ]，合并 `useTable`、`useTableSpan` 至组件内部
- 重构 [ AppText ]，复用 `el-text` 的 `TextProps` 类型并新增 `tag` 属性
- 重构 [ AppIcon ]，Props 继承 `element-plus` 的 `IconProps`
- 重构水印内容为用户标识与日期
- 重构设置/语言/主题状态，收敛为单一数据源并统一由 `watch` 触发
- 新增 `versionFilePlugin` 构建插件，替代原命令行版本文件生成工具

### 0.4.1

_2024-10-25_

#### 错误修复

- 修复日志文件中的错误信息
- 修复角色管理中的错误 api 地址

### 0.4.0

_2024-10-24_

#### 重大变化

- 修改 [ SearchMenu ] 的文件路径
- 修改通配符路由 `name` 为 `not-found`
- 升级项目依赖
- 对 `vite.config.ts` 文件进行拆分优化

#### 新功能

- [ SearchMenu ] 组件添加 i18n 国际化
- 新增 [ AppText ] 组件，用于显示文本内容，支持文本溢出隐藏显示提示
- 新增 [ AppTable ] 组件示例
- 新增版本检测功能，用于检测当前版本是否为最新版本
- 新增 `gzip` 和 `brotli` 压缩
- 新增 [ LayFooter ] 页脚组件
- 设置中添加按钮提示控制
- `dayjs` 新增国际化
- [ LayHeader ] 新增宽度小于 `405px` 后自动隐藏右侧按钮

#### 错误修复

- 修复 `i18n` 数据存放路径错误问题
- 修复返回顶部按钮不显示问题
- 修复 `Layouts` 不能自适应布局问题

#### 重构

- 重构 `404` 页面
- 重构 [ AppTreeFilter ] 组件的文本超出隐藏显示文字提示
- 重构 [ LayMenu ] ，内部添加 [ AppText ] 组件，使目录或菜单隐藏后显示文字提示

### 0.3.0

_2024-10-11_

#### 重大变化

- 重构项目以支持 `英语` 和 `中文` 语言
- `useReset` 添加基本数据类型和引用数据类型不同处理逻辑

#### 新功能

- 添加 `@intlify/vue-i18n-loader` 以支持 `vue-i18n` 的国际化
- 面包屑新增动态显示，当屏幕宽度不足 `768px` 时，会自动隐藏
- 新增 `useEventBus` 基于 `mitt` 的事件总线，用于组件间通信
- [ AppDropdown ] 新增默认插槽，用于自定义下拉内容
- 新增 `setDocumentTitle` 方法，用于设置文档标题

#### 错误修复

- 修复 [ AppSelectIcon ] 样式错乱问题
- 修复退出登录时，个人数据未清空问题

### 0.2.0

_2024-10-01_

#### 重大变化

- 移除 [ app-wrapper ] 改用 css
- 更新项目所使用的依赖

#### 新功能

- 支持 vue-i18n

#### 错误修复

- 修复 `LayHeader` 组件类型错误问题
- 修改错别字和组件路径

#### 重构

- 重构 [ LayHeader ] 组件
- 重构 [ LayMenu ] 组件
- 重构 `i18n` 相关代码
