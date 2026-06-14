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
