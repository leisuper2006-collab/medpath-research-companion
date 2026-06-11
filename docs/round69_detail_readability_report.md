# Round69 详情页证据模块可读性修复报告

## 修复目标

Round68 已经把方法、图谱、文章和开源工具详情页接入“证据镜头”，但在浏览器截图中，证据模块刚进入视口时会受到全站滚动 reveal 动效影响，出现短暂柔焦和透明度不足。该问题会削弱用户要求的 Apple 式产品页阅读质感，也会让科研新手难以快速读清“示例图、来源、输入材料、复核边界”四个关键信息。

## 已修复内容

1. 保留全站滚动动效，但将承载核心说明的 `.story-lead` 从模糊 reveal 中排除。
2. 证据镜头进入视口后立即保持 `opacity: 1`、`filter: none`、`transform: none`。
3. 继续保留章节卡片和后续内容的渐入效果，使页面仍有层次和动态感。
4. 重建静态站点并重新生成桌面端、移动端截图。

## 验证证据

计算样式验证：

- `.story-lead` 父级 `filter: none`
- `opacity: 1`
- `transform: none`

脚本验证：

- `python scripts\round68_verify_detail_evidence_lens.py`

截图：

- `docs/round68_detail_evidence_lens_verified.png`
- `docs/round68_detail_evidence_lens_mobile_verified.png`

## 结果

详情页核心证据模块现在可以在滚入视口时直接阅读，不再出现影响可读性的模糊状态。后续如果继续做 Apple 式长页面，应优先保持“核心文字稳定清晰，背景和次级章节承担动效”的原则。
