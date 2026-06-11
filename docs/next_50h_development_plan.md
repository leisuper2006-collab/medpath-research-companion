# Next 50 Hours Development Plan

## 第 1-5 小时

- 修复 Node.js 权限问题，恢复 Next.js/TypeScript/Tailwind 正常开发链。
- 将当前 FastAPI 托管 SPA 迁移为 React/Vite 或 Next.js 页面。
- 验收点：本地 `npm run dev` 可启动，所有 23 个页面无 404。

## 第 6-15 小时

- 将 mock API 拆分为真实服务层、schema 层和数据层。
- 增加 SQLite 持久化、审计日志和导出记录。
- 验收点：案例、Skill Builder、Provider Test、Governance 审计均可持久记录。

## 第 16-30 小时

- 增强 Case Simulation Lab，加入可配置案例 schema、教师复核流和案例版本管理。
- 为 Plot Studio 接入 R/ggplot2 或后端绘图服务。
- 验收点：生成案例可保存、查询、导出；图表可选择类型和下载。

## 第 31-50 小时

- 接入真实模型 API 的安全网关，完成 D03/D10 字段映射原型。
- 增加用户权限、课程团队空间、教师评价表和真实试点准备包。
- 验收点：在不泄露密钥和隐私的前提下完成小规模课程团队演示。

