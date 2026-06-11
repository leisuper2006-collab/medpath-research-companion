# Round30 3D科研小岛任务护照升级报告

## 本轮目标

本轮针对 `Research Island 3D Prototype` 做实“科研小白可跟着走”的游戏化学习层。此前页面已经能打开、能点击建筑、能更新任务面板，但更像入口说明；本轮把它升级为“科研护照 + 建筑定位 + 任务证据 + 路线卡”的学习地图。

## 已完成内容

1. 新增 `Quest Passport · 科研护照`。
   - 显示已访问建筑数量、进度百分比、推荐下一站、四段学习里程碑和当前聚焦建筑。
   - 目标是让新手不用一次理解整个平台，只需完成一个能留下证据的小任务。

2. 升级右侧建筑任务面板。
   - 新增“解决的问题”“新手提示”“要留下的证据”。
   - 保留三步任务、Skill调用链、示例需求、奖励和安全边界。
   - 新增“重新定位建筑”按钮，方便回到对应3D建筑。

3. 升级“学习进度”和“岛屿任务路线”。
   - 10个进度徽章均可点击定位建筑。
   - 10张建筑路线卡均显示交付物和避坑边界。
   - 路线卡同时提供“在小岛中定位”和“打开任务入口”两个动作。

4. 新增交互函数。
   - `islandPassportMarkup()`
   - `focusIslandBuilding(id)`
   - `updateIslandPassport(building)`
   - `selectIslandBuilding()` 已同步刷新护照、HUD和任务面板。

5. 更新静态资源版本。
   - `apps/web/index.html` 静态资源版本推进到 `round30`。
   - `apps/web/sw.js` 缓存名推进到 `medpath-research-companion-v30`。

## 修改文件

- `apps/web/static/app.js`
- `apps/web/static/styles.css`
- `apps/web/index.html`
- `apps/web/sw.js`
- `scripts/round30_island_quest_upgrade_check.py`

## 验证结果

1. Round30小岛检查：通过。
   - 报告：`docs/round30_island_quest_check.json`
   - 截图：`docs/round30_island_quest_verified.png`
   - 验证项：Three.js canvas非空、科研护照存在、10个路线卡、10个进度徽章、路线卡含交付物和避坑边界、面板含解决问题/新手提示/证据清单、无控制台错误、无乱码标记。

2. 静态资源检查：通过。
   - `python scripts/round27_static_asset_check.py`

3. 产品详情页检查：通过。
   - `python scripts/round28_product_story_check.py`

4. 研究路线生成器检查：通过。
   - `MEDPATH_BASE_URL=http://127.0.0.1:4173 python scripts/round29_journey_blueprint_check.py`

5. API测试：通过。
   - `pytest apps/api/tests -q`
   - 结果：20 passed。

6. GitHub发布预检：通过但暂不可直接发布。
   - `python scripts/round26_github_publish_preflight.py`
   - 无明文密钥发现，静态包完整。
   - 当前目录不是Git仓库，且本机未检测到 `gh`，因此 `can_publish_now=false`。

## 真实性与安全边界

- 本轮没有宣称任何真实平台上线。
- 没有生成真实患者数据。
- 没有伪造课程试点、教师评分或学生问卷。
- 医学AI相关输出仍限定为教学与科研训练，不替代临床诊断。

## 下一步建议

1. 继续把“科研小岛”升级为更完整的任务游戏：增加任务完成状态、建筑解锁动画、路线奖励和桌宠提示联动。
2. 在方法详情、文章详情、图谱详情中加入与小岛任务互通的“加入护照”按钮。
3. 若准备发布，先初始化Git仓库或提供GitHub远程仓库URL，再运行发布预检。
