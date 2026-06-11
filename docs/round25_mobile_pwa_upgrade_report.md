# Round25移动端PWA增强报告

## 目标

在不声称已完成原生 Android/iOS App 的前提下，将现有移动端网页路线增强为可安装的 PWA（Progressive Web App，渐进式 Web 应用）基础形态，便于手机端演示和后续发布。

## 已完成内容

- 新增 Web App manifest：`apps/web/manifest.webmanifest`
- 新增 Service Worker：`apps/web/sw.js`
- 新增应用图标：`apps/web/static/icons/medpath-icon.svg`
- 更新入口 HTML：`apps/web/index.html`
  - 加入 `theme-color`
  - 加入 `manifest` 链接
  - 加入 SVG favicon
  - 注册 service worker
- 更新本地 Python 服务：`apps/api/app/main.py`
  - 支持 `/manifest.webmanifest`
  - 支持 `/sw.js`
- 更新静态发布脚本：`scripts/build_static_release.py`
  - 将 `manifest.webmanifest`、`sw.js`、图标复制到 `dist/github-pages-demo`
  - 将静态 HTML 中的 manifest/icon 链接转换为相对路径
- 新增验证脚本：`scripts/round25_pwa_check.py`

## 验证结果

验证命令：

```powershell
python scripts\round25_pwa_check.py
pytest apps\api\tests -q
python scripts\round12_release_readiness_check.py
python scripts\round13_content_uniqueness_audit.py
python scripts\build_static_release.py
```

验证摘要：

- `/mobile-app` 页面可打开。
- `manifest` 链接存在：`/manifest.webmanifest`。
- 应用图标存在：`/static/icons/medpath-icon.svg`。
- 浏览器支持 Service Worker。
- Service Worker 注册数：1。
- 浏览器 console warning/error：0。
- API 测试：20 passed。
- 发布前 readiness：通过。
- 内容唯一性审计：无失败项。
- 静态包已包含：
  - `dist/github-pages-demo/manifest.webmanifest`
  - `dist/github-pages-demo/sw.js`
  - `dist/github-pages-demo/static/icons/medpath-icon.svg`

机器可读报告：

- `docs/round25_pwa_check.json`

## 边界说明

- 当前增强是 PWA 安装形态，不是原生 Android/iOS App。
- 当前未生成 APK、IPA 或应用商店包。
- 当前 PWA 不处理真实患者数据，不接入真实临床系统。
- 医学AI输出仅用于教学与科研训练，不替代临床诊断。

## 后续可增强

- 使用 Android 测试插件创建 WebView/Capacitor 原生壳。
- 增加离线任务草稿、本地收藏和学习进度同步。
- 将 Figma 云端设计恢复后与 PWA 页面进行像素级对照。
