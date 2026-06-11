from __future__ import annotations

import json
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "outputs" / "mobile_app_handoff" / "figma_import_pack"
SOURCE_SVG = ROOT / "outputs" / "mobile_app_handoff" / "medpath_mobile_app_figma_handoff.svg"


TOKENS = {
    "name": "MedPath Mobile App Design Tokens",
    "version": "round63",
    "colors": {
        "deep": "#102033",
        "teal": "#0F766E",
        "blue": "#255AA8",
        "paper": "#F7FBFA",
        "line": "#DCE8E7",
        "muted": "#617084",
        "warning": "#B45309",
        "danger": "#BE123C",
        "success": "#15803D",
    },
    "typography": {
        "fontFamily": "Inter / Microsoft YaHei / PingFang SC",
        "screenTitle": {"size": 28, "lineHeight": 34, "weight": 800},
        "sectionTitle": {"size": 18, "lineHeight": 25, "weight": 750},
        "body": {"size": 14, "lineHeight": 23, "weight": 400},
        "caption": {"size": 12, "lineHeight": 18, "weight": 500},
    },
    "radius": {"card": 18, "button": 14, "phone": 36},
    "spacing": {"xs": 6, "sm": 10, "md": 16, "lg": 24, "xl": 36},
}


SCREENS = [
    {
        "id": "home",
        "name": "科研任务首页",
        "goal": "让科研新手用一句话描述需求，并立即获得方法、图表、文章、工具与审查路线。",
        "primary_actions": ["生成路线", "看推荐方法", "进入伦理审查"],
    },
    {
        "id": "journey",
        "name": "研究路径生成器",
        "goal": "把基因敲除、Meta分析、单细胞、病理PBL等需求拆成一周可执行路线。",
        "primary_actions": ["选择 starter", "查看7天路线", "导出任务包"],
    },
    {
        "id": "method",
        "name": "方法详情页",
        "goal": "像产品页一样解释每个方法的用途、输入、输出、失败条件、示例图和学习路径。",
        "primary_actions": ["查看示例图", "复制模型提示", "进入数据审查"],
    },
    {
        "id": "plot",
        "name": "科研图详情页",
        "goal": "展示该图回答什么问题、需要哪些字段、示例图如何生成、数据不合格时如何修正。",
        "primary_actions": ["检查字段", "查看R/ggplot2路线", "生成图表任务"],
    },
    {
        "id": "governance",
        "name": "伦理复核页",
        "goal": "在AI输出进入论文、课程或训练材料前检查隐私、伪造引用、临床误导和教师复核。",
        "primary_actions": ["运行风险审计", "填写教师复核", "导出审计记录"],
    },
]


FIGMA_SCRIPT = r"""
// MedPath Round63 Figma reconstruction script.
// Paste into a Figma plugin environment or run through use_figma after MCP recovers.
// It creates a mobile app handoff board with five core screens.

await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Bold" });

const colors = {
  deep: { r: 16/255, g: 32/255, b: 51/255 },
  teal: { r: 15/255, g: 118/255, b: 110/255 },
  blue: { r: 37/255, g: 90/255, b: 168/255 },
  paper: { r: 247/255, g: 251/255, b: 250/255 },
  line: { r: 220/255, g: 232/255, b: 231/255 },
  muted: { r: 97/255, g: 112/255, b: 132/255 },
  white: { r: 1, g: 1, b: 1 }
};

const createdNodeIds = [];
function solid(color) {
  return [{ type: "SOLID", color }];
}
function makeText(parent, text, size, weight = "Regular", color = colors.deep) {
  const node = figma.createText();
  node.fontName = { family: "Inter", style: weight === "Bold" ? "Bold" : "Regular" };
  node.characters = text;
  node.fontSize = size;
  node.lineHeight = { unit: "PIXELS", value: Math.round(size * 1.35) };
  node.fills = solid(color);
  parent.appendChild(node);
  createdNodeIds.push(node.id);
  return node;
}
function makePill(parent, text, fill = colors.paper) {
  const pill = figma.createAutoLayout("HORIZONTAL", {
    name: `Pill / ${text}`,
    itemSpacing: 6,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    cornerRadius: 12,
    fills: solid(fill),
    strokes: solid(colors.line),
    strokeWeight: 1,
  });
  makeText(pill, text, 11, "Bold", colors.deep);
  parent.appendChild(pill);
  createdNodeIds.push(pill.id);
  return pill;
}
function makeCard(parent, title, body) {
  const card = figma.createAutoLayout("VERTICAL", {
    name: `Card / ${title}`,
    itemSpacing: 8,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 14,
    paddingRight: 14,
    cornerRadius: 16,
    fills: solid(colors.white),
    strokes: solid(colors.line),
    strokeWeight: 1,
    layoutSizingHorizontal: "FILL",
  });
  makeText(card, title, 14, "Bold", colors.deep);
  makeText(card, body, 11, "Regular", colors.muted);
  parent.appendChild(card);
  createdNodeIds.push(card.id);
  return card;
}

const page = figma.createPage();
page.name = "MedPath Mobile App Handoff Round63";
await figma.setCurrentPageAsync(page);

const board = figma.createAutoLayout("VERTICAL", {
  name: "MedPath Mobile App Handoff Board",
  itemSpacing: 28,
  paddingTop: 48,
  paddingBottom: 48,
  paddingLeft: 48,
  paddingRight: 48,
  fills: solid(colors.paper),
});
board.x = 120;
board.y = 120;
page.appendChild(board);
createdNodeIds.push(board.id);

makeText(board, "MedPath Research Companion 手机端App路线", 34, "Bold", colors.deep);
makeText(board, "面向科研新手：从一句需求到方法、图表、文章、审查和教师复核的移动端任务流。", 16, "Regular", colors.muted);

const row = figma.createAutoLayout("HORIZONTAL", { name: "Core Mobile Screens", itemSpacing: 22 });
board.appendChild(row);
createdNodeIds.push(row.id);

const screens = [
  ["科研任务首页", "一句话描述需求，立即生成路线预览。", ["生成路线", "推荐方法", "安全边界"]],
  ["研究路径生成器", "把基因敲除、Meta分析、单细胞拆成一周路线。", ["7天计划", "材料清单", "导师复核"]],
  ["方法详情页", "像产品页一样解释方法用途、输入输出和示例图。", ["示例图", "失败条件", "学习路径"]],
  ["科研图详情页", "先看图回答什么问题，再做字段审查和R路线。", ["字段契约", "R/ggplot2", "数据审查"]],
  ["伦理复核页", "检查隐私、伪造引用、临床误导和教师复核。", ["风险审计", "复核表", "导出记录"]],
];

for (const [title, body, pills] of screens) {
  const phone = figma.createAutoLayout("VERTICAL", {
    name: `Phone / ${title}`,
    itemSpacing: 12,
    paddingTop: 26,
    paddingBottom: 24,
    paddingLeft: 18,
    paddingRight: 18,
    cornerRadius: 36,
    fills: solid(colors.white),
    strokes: solid(colors.line),
    strokeWeight: 1,
    width: 252,
    height: 520,
  });
  row.appendChild(phone);
  createdNodeIds.push(phone.id);
  makePill(phone, "MedPath", colors.paper);
  makeText(phone, title, 22, "Bold", colors.deep);
  makeText(phone, body, 12, "Regular", colors.muted);
  for (const pill of pills) makePill(phone, pill);
  makeCard(phone, "下一步行动", "页面必须告诉新手现在该做什么、为什么做、完成后留下什么证据。");
  makeCard(phone, "边界提示", "仅用于教学与科研训练，不替代临床诊断。");
}

return { createdNodeIds, screenCount: screens.length, boardId: board.id };
"""


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    if SOURCE_SVG.exists():
        shutil.copy2(SOURCE_SVG, OUT / "medpath_mobile_app_figma_handoff.svg")

    manifest = {
        "name": "MedPath Mobile App Figma Import Pack",
        "version": "round63",
        "source_svg": "medpath_mobile_app_figma_handoff.svg",
        "tokens": "medpath_mobile_tokens.json",
        "figma_rebuild_script": "figma_use_rebuild_mobile_app.js",
        "screens": SCREENS,
        "status": "Figma MCP unavailable in current run; local import pack prepared.",
        "safety_boundary": "Only for teaching and research training; not for clinical diagnosis.",
    }
    (OUT / "figma_import_manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "medpath_mobile_tokens.json").write_text(json.dumps(TOKENS, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "figma_use_rebuild_mobile_app.js").write_text(FIGMA_SCRIPT.strip() + "\n", encoding="utf-8")

    readme = f"""# MedPath Mobile App Figma Import Pack

本目录是 Round63 生成的 Figma 可导入/可复建设计包。当前 Figma MCP 握手失败，未能直接创建线上 Figma 文件，因此这里提供本地可审查交付物，等待 Figma 连接恢复后可直接复建。

## 文件

- `medpath_mobile_app_figma_handoff.svg`：当前手机端App交付设计板，可直接拖入 Figma。
- `figma_import_manifest.json`：导入清单、屏幕定义和安全边界。
- `medpath_mobile_tokens.json`：颜色、字体、圆角和间距 token。
- `figma_use_rebuild_mobile_app.js`：可在 Figma Plugin API / use_figma 中运行的复建脚本。

## 核心屏幕

{chr(10).join([f"- {s['name']}：{s['goal']}" for s in SCREENS])}

## 使用方式

1. 如果只需要视觉交付：把 `medpath_mobile_app_figma_handoff.svg` 拖入 Figma。
2. 如果需要可编辑组件：在 Figma 插件环境或 `use_figma` 恢复后运行 `figma_use_rebuild_mobile_app.js`。
3. 导入后应人工检查中文字体、间距、按钮状态和移动端滚动层级。

## 边界

- 本包不代表已经创建线上 Figma 文件。
- 不含学校 logo、OpenAI logo、真实患者信息或真实平台账号。
- 医学AI输出仅用于教学与科研训练，不替代临床诊断。
"""
    (OUT / "README.md").write_text(readme, encoding="utf-8")
    print(json.dumps({"output": str(OUT), "files": sorted(p.name for p in OUT.iterdir())}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
