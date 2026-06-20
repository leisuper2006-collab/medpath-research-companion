// Round70 local Figma rebuild helper.
// Paste into a Figma plugin code context. It creates rough editable frames only;
// import the SVG for full visual fidelity.
const screens = [
  "今天先完成三件事",
  "基因敲除怎么选",
  "这张图在讲什么",
  "我要写Meta分析",
  "接入自己的API",
  "提交前谁来把关",
];
figma.currentPage.name = "MedPath Mobile Round70 Handoff";
screens.forEach((title, index) => {
  const frame = figma.createFrame();
  frame.name = `Round70 / ${String(index + 1).padStart(2, "0")} / ${title}`;
  frame.resize(390, 844);
  frame.x = index * 430;
  frame.y = 0;
  frame.cornerRadius = 32;
  frame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  const label = figma.createText();
  label.name = "screen-title";
  label.characters = title;
  label.x = 28;
  label.y = 56;
  label.fontSize = 24;
  frame.appendChild(label);
});
figma.notify("MedPath Round70 mobile frames created. Import SVG for polished layers.");
