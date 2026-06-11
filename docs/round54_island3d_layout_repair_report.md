# Round54 3D research island layout repair report

## 修复目标

本轮针对 3D 科研小岛的第一屏体验进行修复。上一版虽然具备交互地图、任务建筑和科研小向导，但截图暴露出两个问题：

1. Three.js 视角下建筑集中在画面上缘，第一屏只露出少量建筑；
2. `island3d-layout` 使用 `align-items: stretch`，左侧舞台被右侧长任务面板拉高到 1400px 以上，导致画布下方出现大面积空白。

这类问题会直接影响用户对“游戏化学习入口”的第一印象，因此优先修复。

## 主要改动

### 1. 默认启用等距 3D Canvas 小岛

修改位置：

- `apps/web/static/app.js`

改动说明：

- `initIsland3D()` 默认使用 Canvas 等距地图渲染；
- 模式标签改为“互动地图”；
- 保留 Three.js 相关代码作为后续增强路线，但不再让未充分调优的相机视角破坏默认体验。

当前效果：

- 第一屏可见 10 个任务建筑中的主要建筑群；
- 建筑有图标、名称、路径虚线、阴影和水面/地块背景；
- 科研小向导、任务面板、学习护照和建筑路线同时可用。

### 2. 修复舞台拉伸空白

修改位置：

- `apps/web/static/styles.css`

改动说明：

- `.island3d-layout` 从 `align-items: stretch` 改为 `align-items: start`；
- 修复后浏览器计算高度：
  - canvas 高度：620px；
  - stage 高度：660px；
  - 原异常 stage 高度：约 1436px。

这使小岛舞台不再被右侧长面板强制拉伸，消除了大面积空白。

### 3. 改善滚动锚点和 fallback 画布尺寸

修改位置：

- `apps/web/static/styles.css`
- `apps/web/static/app.js`

改动说明：

- 为 `.island3d-stage` 增加 `scroll-margin-top: 150px`，避免固定导航遮住锚点；
- fallback canvas 固定为 620px 高度，与舞台高度一致；
- 重新调整 Canvas 建筑坐标，让建筑群进入可视中心。

## 验证证据

验证脚本：

- `scripts/round46_verify_island3d_experience.py`

截图：

- `docs/round46_island3d_verified.png`

验证结果：

```json
{
  "has_island_stage": true,
  "has_three_root": true,
  "has_canvas": true,
  "has_passport": true,
  "has_panel": true,
  "badge_count": 10,
  "quest_cards": 10,
  "body_has_mojibake": false,
  "has_safety_boundary": true
}
```

回归检查：

```powershell
python scripts\round27_static_asset_check.py
python scripts\round28_product_story_check.py
python scripts\round31_content_uniqueness_audit.py
pytest apps\api\tests -q
python scripts\round44_verify_plot_article_interactions.py
python scripts\round45_verify_tool_demand_package.py
python scripts\round46_verify_island3d_experience.py
```

全部通过。

## 当前边界

- 当前默认版本是“等距 3D Canvas 互动地图”，不是最终 Three.js 高精度游戏场景；
- Three.js 代码仍保留，但需要后续单独进行相机、建筑分布、角色动画和点击拾取调优；
- 本地页面不处理真实患者数据，不替代导师、教师或伦理审批。

## 后续升级建议

1. 将 Three.js 版本改造成独立可切换的“探索模式”，先在单独页面调好相机和交互，再作为默认体验；
2. 为小岛建筑增加 hover/selected 的更强视觉状态，例如建筑发光、路径点亮、任务徽章翻面；
3. 增加“桌宠拖拽/收起/语音气泡”体验，让新手可以从任意页面召唤路线建议；
4. 将当前小岛、方法卡、图谱卡和文章流程抽象成 Figma 组件，用于移动端 App 原型。
