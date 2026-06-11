# Round11 视觉与交互参考调研记录

## 调研目的

用户要求页面不要继续停留在单调卡片堆叠，需要参考更成熟、更热门的网站与App设计方式。本文件记录本轮调研到的可借鉴方向，后续只借鉴设计原则与交互结构，不复制授权不明代码或商业模板。

## 可借鉴方向

1. Aceternity UI  
   适合借鉴：动效型 hero、柔和背景、滚动叙事、悬浮卡片与高质感过渡。  
   来源：[Aceternity UI](https://ui.aceternity.com/)

2. Magic UI  
   适合借鉴：React + Tailwind + Motion 的开源动效组件思路，尤其适合插件卡片、光效边框和微交互。  
   来源：[Magic UI](https://magicui.design/)

3. shadcn/ui block libraries  
   适合借鉴：稳定组件、表单、导航、命令面板、仪表盘块和AI产品常见交互。  
   参考来源：[12 Best shadcn/ui Block Libraries 2026](https://adminlte.io/blog/shadcn-ui-block-libraries/)

4. Figma UI kits and design systems  
   适合借鉴：变量、Auto Layout、组件变体、移动端断点和可维护设计系统。  
   参考来源：[Muzli 2026 Figma UI kits](https://muz.li/blog/best-figma-ui-kits-and-design-systems-for-2026/)

5. Dashboard design best practices  
   适合借鉴：信息层级、图表区域、行动入口、状态提示和任务型仪表盘。  
   参考来源：[Toptal dashboard design examples](https://www.toptal.com/designers/dashboard-design/top-data-visualization-dashboard-examples)

## 对本项目的转化

- 方法、图谱、文章和开源工具详情页采用“产品式hero + 示例图 + 四段解释 + 来源证据 + 需求输入”的长页结构。
- 插件、方法、图谱不再只靠重复卡片，而是每个最小单元都绑定独立标题、独立示例图、公开来源和模型网关提示词。
- 后续视觉升级应优先做三件事：更精致的滚动叙事、更丰富的状态动效、更像App的移动端交互。

## 授权边界

本轮没有复制外部UI库代码。任何后续引入第三方UI包，都必须先核对license，并记录到项目文档。
