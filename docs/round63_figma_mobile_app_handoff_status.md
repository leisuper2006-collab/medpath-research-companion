# Round63 Figma移动端App交付状态报告

## 本轮目标

围绕总目标中的“Figma移动端App路线”，本轮优先尝试使用Figma工具创建线上设计文件，并在不可用时生成可导入、可复建、可审查的本地设计包，避免把本地SVG误写成已经上传到Figma。

## Figma连接状态

已按Figma工具要求加载：

- `figma-create-new-file`
- `figma-use`

随后调用Figma账号检查工具，但MCP启动失败：

```text
MCP startup failed: handshaking with MCP server failed
Transport channel closed, when send initialized notification
```

因此，本轮没有创建线上Figma文件，也没有声称已完成Figma云端写入。

## 已完成的替代交付

已生成本地Figma导入包：

```text
outputs/mobile_app_handoff/figma_import_pack/
```

包含：

- `medpath_mobile_app_figma_handoff.svg`：可直接拖入Figma的手机端App交付板。
- `figma_import_manifest.json`：屏幕、用途、状态和安全边界清单。
- `medpath_mobile_tokens.json`：颜色、字体、圆角、间距等设计token。
- `figma_use_rebuild_mobile_app.js`：Figma Plugin API / use_figma恢复后可运行的复建脚本。
- `README.md`：导入和复建设计说明。

## 移动端核心屏幕

导入包定义了五个手机端核心屏幕：

1. 科研任务首页：让科研新手用一句话描述需求，并立即获得方法、图表、文章、工具与审查路线。
2. 研究路径生成器：把基因敲除、Meta分析、单细胞、病理PBL等需求拆成一周可执行路线。
3. 方法详情页：像产品页一样解释每个方法的用途、输入、输出、失败条件、示例图和学习路径。
4. 科研图详情页：展示该图回答什么问题、需要哪些字段、示例图如何生成、数据不合格时如何修正。
5. 伦理复核页：在AI输出进入论文、课程或训练材料前检查隐私、伪造引用、临床误导和教师复核。

## 验证结果

已运行：

```powershell
python scripts\round63_verify_figma_import_pack.py
```

结果：

```json
{
  "file_count": 5,
  "screens": [
    "科研任务首页",
    "研究路径生成器",
    "方法详情页",
    "科研图详情页",
    "伦理复核页"
  ],
  "missing": [],
  "failures": []
}
```

## 后续恢复Figma后的操作

当Figma MCP恢复或用户在Figma本地操作时，可执行以下路径：

1. 将 `medpath_mobile_app_figma_handoff.svg` 直接拖入Figma，获得视觉交付板。
2. 若需要可编辑组件，在Figma插件环境或`use_figma`中运行 `figma_use_rebuild_mobile_app.js`。
3. 人工检查中文字体、按钮状态、滚动层级、移动端文本换行和安全边界。
4. 若后续Figma工具恢复，可重新运行线上创建流程，将本地导入包迁移到Figma云端文件。

## 边界声明

- 本报告不声称已经创建线上Figma文件。
- 本导入包不含真实患者数据、真实账号密钥、学校logo或OpenAI logo。
- 医学AI输出仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置。
