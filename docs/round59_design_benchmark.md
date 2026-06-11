# Round59 设计标杆与转译规则

## 调研结论

本轮调研的目的不是复制某个商业网站，而是提炼能服务“科研新手学习平台”的界面规律：让用户点进一个方法、图谱、文章流程或开源工具时，能像阅读高质量产品页一样逐步理解“它解决什么问题、要准备什么数据、能产出什么、有什么风险、下一步该做什么”。

## 可转译的参考

1. Apple式产品页叙事  
   参考来源：[UX Planet关于Apple产品页分析](https://uxplanet.org/8-things-i-learned-analyzing-apples-product-pages-9a5284681b37) 与 [CSS-Tricks关于Apple滚动动画](https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/)  
   转译方式：每个方法/文章/图谱详情页采用“主视觉、一句话价值、示例图、分段解释、复核清单”的滚动叙事，不让用户先面对一堆参数。

2. Mobbin移动端真实流程库  
   参考来源：[Mobbin移动App设计模式](https://mobbin.com/explore/mobile)  
   转译方式：手机端不做网页缩小版，而做任务型入口：科研首页、方法导航、文章流程、绘图审查、治理复核。每个入口都对应一个可完成的科研动作。

3. Figma Dashboard与App模板  
   参考来源：[Figma Dashboard Templates](https://www.figma.com/templates/dashboard-designs/)  
   转译方式：把组件分为任务卡、方法卡、示例图区、风险提示、教师复核表、底部导航和桌宠对话，后续可在Figma中拆成组件库。

4. Linear式专业工具感  
   参考来源：[Linear官网](https://linear.app/)  
   转译方式：保持克制配色、清晰层级、明确状态和小幅动效。MedPath不采用暗黑工程风，而是转译为白底医学教育风。

5. App Store自定义产品页思路  
   参考来源：[Apple Developer Custom Product Pages](https://developer.apple.com/app-store/custom-product-pages/)  
   转译方式：不同用户入口使用不同“产品页”：科研新手看学习路径，教师看复核和评价，研究生看文章流程，工程用户看Skill与API。

## 当前落实到站点的规则

- 首页承担“任务入口”，不是营销页。
- 方法、图谱、文章、工具详情页承担“产品说明页”，必须有独立介绍、示例图、来源与边界。
- 手机端承担“随身任务卡”，不承载所有复杂配置。
- 桌宠承担“卡住时的导航”，不是装饰。
- 所有医学AI输出保持教学与科研训练边界，不替代临床诊断。

## Figma状态

已尝试访问Figma连接器，但当前MCP握手失败，无法直接创建线上Figma文件。本轮采用本地可导入Figma的SVG交付板作为替代资产：

- `outputs/mobile_app_handoff/medpath_mobile_app_figma_handoff.svg`

后续一旦Figma连接恢复，可把该SVG导入Figma，并拆分为以下组件：

- Task Card
- Method Card
- Article Workflow Card
- Example Figure Panel
- Audit Notice
- Teacher Review Checklist
- Desk Pet Dialogue
- Bottom Navigation
