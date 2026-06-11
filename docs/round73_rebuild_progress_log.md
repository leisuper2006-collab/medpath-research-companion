# Round73 重构进度记录

日期：2026-06-11

## 本轮目标

把用户提出的 MedPath Research Companion 2.0 重构方向写入仓库底层约束，并在公开网站上先落地一层可见的新产品壳层，避免后续继续按旧站点“工具目录”思路小修小补。

## 已完成

1. 已重写 `README.md`，把以下内容写成每轮硬约束：
   - 不再把虚拟敲除/虚拟扰动作为一级大类；
   - 扩展到基础医学、医学 AI、生物信息学、单细胞、空间组学、统计、机器学习、科研写作、Meta 分析、科研绘图、开源工具、教学案例、伦理治理；
   - 文案面向科研新手，避免申报书式和 AI 腔；
   - 每个最小单元必须有独特介绍、示例输入、示例输出、示例图、学习路径和风险边界；
   - 主站参考医疗科技 SaaS Dashboard；
   - 手机端必须独立设计；
   - 科研小岛必须成为建筑化、游戏化、可交互的科研入口；
   - 每次可验证更新都要发布 GitHub Pages。

2. 已新增 `docs/medpath_2_0_rebuild_master_goal.md`，作为后续持续开发的主目标文件。

3. 已新增 Round73 前端覆盖层：
   - `apps/web/static/round73.css`
   - `apps/web/static/round73.js`

4. 已更新入口和静态发布脚本：
   - `apps/web/index.html` 引入 Round73 样式和脚本；
   - `apps/web/sw.js` 升级缓存版本并加入 Round73 静态文件；
   - `scripts/build_static_release.py` 支持 GitHub Pages 相对路径转换。

5. 新壳层已覆盖以下入口：
   - Home 首页；
   - Learn 学习与教学；
   - Research 科研工作台；
   - Skills 市场；
   - Cases 案例与模板；
   - Tools 开源工具导航；
   - Plot Studio 科研绘图工作室；
   - Method Runner 方法运行器；
   - Community 社区；
   - Profile 个人主页；
   - Island 科研小岛。

6. 已在页面中显式修正分类：
   - 虚拟扰动/虚拟敲除放入 `生物信息学 -> 单细胞 -> 扰动分析`；
   - 不再作为网站一级主类。

7. 已完成第一版移动端底部导航：
   - Home；
   - Explore；
   - Island；
   - Community；
   - Profile。

8. 已完成第一版科研小岛 MVP：
   - 低多边形/2.5D 风格舞台；
   - 图书馆、教学楼、病理室、实验楼、绘图工坊、Skill 工坊、社区中心、档案馆等建筑；
   - 建筑点击后弹出对话框；
   - 建筑可跳转到相关功能页面；
   - 初步积分/点赞机制。

9. 已用 Chrome headless 生成验证截图：
   - `screenshots/round73_home.png`
   - `screenshots/round73_island_v2.png`
   - `screenshots/round73_mobile_home_v6.png`

## 当前仍是 MVP 的部分

1. 科研小岛目前是 CSS/HTML 低多边形原型，还不是完整 Three.js 游戏。
2. 社区、好友、拜访、排行榜、积分商店目前是展示型原型，未接入真实账户系统。
3. 各方法、工具、图谱、文章流程仍需要进一步逐条改写，避免旧数据中的模板化叙事。
4. 示例图目前主要复用已有公开/教学示例资源，仍需逐步为每个最小单元补充真实来源说明和可复现边界。
5. Figma 设计文件尚未生成，本轮先以代码实现设计系统雏形。

## 下一轮优先级

1. 改写 Tools/Open Source Navigator 的真实仓库和 License 字段，减少“待核对”。
2. 为 Plot Studio 增加更多真实可复现示例图和字段检查。
3. 将 Profile 和 Community 从展示型原型扩展到可交互的点赞、收藏、关注和排行榜。
4. 将 Island Mode 升级为数据驱动建筑库，至少扩展到 20 个建筑/装饰。
5. 使用 Figma 或设计文档进一步固化主站和移动端设计规范。

## 边界声明

本轮没有声称完成真实课程试点、真实平台上线、真实教师评分或真实教学效果提升。医学 AI 输出仍限定为教学与科研训练，不替代临床诊断，不用于真实患者处置。
