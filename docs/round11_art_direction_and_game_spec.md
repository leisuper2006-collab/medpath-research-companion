# Round 11 Art Direction and Game Spec

## 1. Positioning

MedPath Research Island is a learning and navigation layer for biomedical research education. It should make first contact less intimidating, but it must not replace the serious desktop workbench for data analysis, manuscript preparation, review, governance, or API configuration.

The island experience should answer three user needs:

- Help beginners choose the right route when they do not know method names.
- Give returning users a memorable map of research workflows.
- Provide a gentle desk-pet guide that reminds users of safety boundaries before risky actions.

## 2. Visual Direction

Theme: medical research x Van Gogh starry night x Animal Crossing-like cozy island.

Core visual language:

- Low-poly island terrain with soft slopes, small bridges, stone paths, glowing windows, and friendly proportions.
- Swirling starry sky motifs inspired by post-impressionist brush motion, implemented as original textures rather than copied artwork.
- Biomedical motifs used as subtle worldbuilding: glass slides, cells, sequencing lanes, notebooks, microscopes, evidence stars, and abstract pathway constellations.
- Warm, low-pressure atmosphere with readable labels and clear navigation.
- Serious work surfaces remain clean, high contrast, and evidence-first.

Hard exclusions:

- No real school logo, hospital logo, department badge, journal logo, or institutional seal.
- No real patient image, face, scan, pathology slide, medical record screenshot, or identifiable clinical material.
- No brand-like marks that could be confused with a real hospital or university.
- No decorative scientific image manipulation that changes the meaning of real data.

## 3. Island Buildings

The first island release should read from `data/research_island_buildings.json`. Each building has a stable `id`, user-facing `name`, educational `role`, `linked_route`, NPC line, beginner task, reward badge, and safety note.

Recommended first visible buildings:

- 方法图书灯塔: method search and method routing.
- 基因工坊: gene perturbation method family.
- 星空绘图画室: research plotting and figure design.
- 论文写作港: manuscript and review article workflows.
- 数据诊所: data audit and table readiness.
- 伦理花园: privacy, governance, and research integrity.
- 模型驿站: API and provider configuration safety.
- 复核观星台: review of AI output, statistics, references, and figures.
- 合成案例营地: safe practice with synthetic cases.
- 成果邮局: export readiness and delivery checklist.

## 4. Three.js First Implementation Scope

First version scope should be intentionally small:

- One `/island` route or equivalent standalone page.
- Full-viewport Three.js canvas with a low-poly island, water plane, starry sky dome, and soft ambient lighting.
- 8 to 10 clickable building markers loaded from JSON.
- Simple hover label, focus outline, and selected-building detail panel.
- Click building to open a panel with role, NPC dialogue, beginner task, reward badge, safety note, and route button.
- Desk pet entry fixed in the lower-right UI layer.
- Keyboard support for cycling buildings and opening the selected building.
- Mobile fallback that uses the same JSON as a vertical island map or simplified 2.5D scene.

Not in first version:

- Complex character pathfinding.
- Multiplayer.
- Inventory economy.
- Real patient data import.
- Real institution branding.
- Heavy GLTF asset pipeline.
- Replacing current serious workbench routes.

## 5. Desk Pet Entry

The desk pet should be present in both island mode and serious workbench mode, but its tone changes by context.

Entry behavior:

- Lower-right floating button with original pet artwork or simple low-poly avatar.
- Opens compact dialogue panel with quick intents: 找方法, 写文章, 画图, 数据审查, API配置, 安全边界, 游戏模式.
- Dialogue scripts read from `data/pet_dialogues.json`.
- Each reply includes a route suggestion and explicit boundary note.
- Pet can recommend a route, but must not execute high-risk actions without user confirmation.

Tone:

- Friendly, concise, and educational.
- Encourages the user to clarify research question, data type, and safety constraints.
- Does not promise publication, diagnosis, treatment, statistical significance, or model performance.

## 6. Serious Workbench Boundary

Game mode is a doorway, not the laboratory.

Required product rule:

- Island mode can teach, orient, motivate, and route.
- Serious work must remain in the established workbench pages for methods, writing, plotting, data audit, review, governance, export, and settings.
- Every island building must route to a serious tool or learning page.
- Badges represent learning progress only; they are not credentials, certifications, clinical competence, or research compliance proof.
- Any output meant for manuscript, presentation, analysis, or teaching must pass through review and export checks before use.

## 7. Asset Production Notes

Asset families:

- Terrain: island base, paths, water, rocks, garden beds.
- Buildings: lighthouse, workshop, studio, harbor, clinic, garden, station, observatory, camp, post office.
- Pet: original mascot variants such as star-cell pet, slide assistant, or notebook sprite.
- UI icons: route, badge, warning, task, review, export, privacy.

Production constraints:

- Use original generated or hand-authored assets only.
- Avoid real logos and protected institutional symbols.
- Use synthetic, abstract biomedical imagery.
- Keep texture sizes modest for mobile performance.
- Provide alt text or accessible labels for clickable buildings.

## 8. Success Criteria

The first island version is successful if:

- A beginner can identify where to find methods, writing help, plotting help, data audit, API settings, and safety guidance.
- A user can leave island mode and enter the serious workbench in one click.
- The desk pet provides helpful route suggestions with clear safety boundaries.
- The scene remains performant on mobile-class hardware or gracefully falls back to a simpler map.
- No real school, hospital, or patient visual asset appears anywhere in the game layer.
