# Round 11 Mobile App Screen Spec

## 1. Mobile Product Role

The mobile app should be a research companion, not a compressed clone of the desktop workbench. It is best for triage, learning, reminders, route selection, progress review, and lightweight drafting. Heavy data processing, full manuscript assembly, complex visualization, and final export should continue on desktop or PWA workbench surfaces.

Design target:

- Suitable for later Figma handoff, Android WebView, PWA, or React Native implementation.
- 10 primary mobile frames.
- Clear tap targets, readable Chinese text, restrained cards, and explicit safety prompts.
- No real school or hospital logo.
- No real patient image.

Common navigation:

- Bottom tabs: 今日, 方法, 文章, 绘图, 我的.
- Desk pet floating entry appears on major screens, except splash.
- Safety boundary link appears in settings and any screen involving data, API, or clinical wording.

## 2. Frame 01: Splash and Safe Start

Purpose:

- Introduce MedPath Companion and set the safety tone.

Content:

- App name: MedPath 科研伴侣.
- Abstract starry island background using original texture.
- Small original desk-pet mascot.
- Short subtitle: 科研方法、写作、绘图与复核助手.
- Safety microcopy: 不替代医生、导师、统计师或伦理审查.

Components:

- App logo as original generic star-cell mark.
- Primary button: 开始.
- Secondary text link: 查看安全边界.

Interaction:

- Tap 开始 to Today Dashboard.
- Tap safety link to Governance and Safety frame.

Android/PWA notes:

- Can be implemented as launch route with local cached artwork.
- Do not require login for first educational preview.

## 3. Frame 02: Today Dashboard

Purpose:

- Give the user a daily command center for research tasks.

Content:

- Greeting from desk pet.
- Continue last task card.
- Four quick actions: 找方法, 写文章, 画图, 数据体检.
- Safety reminder card.
- Recent progress list: method card, draft outline, audit report, figure plan.

Components:

- Top app bar with date and notification icon.
- Compact task cards.
- Icon buttons for quick actions.
- Bottom navigation.
- Floating desk pet entry.

Interaction:

- Quick action opens corresponding tab or flow.
- Continue card resumes last route.
- Safety card opens Governance and Safety frame.

Android/PWA notes:

- Should support offline display of recent cached tasks.
- Notifications can later map to Android local notifications.

## 4. Frame 03: Method Explorer

Purpose:

- Let beginners find methods by research question rather than method name.

Content:

- Search bar: 输入研究问题或方法名.
- Segmented filter: 统计, 组学, 实验, 机器学习, 综述.
- Beginner question builder card.
- Recommended method cards with: solves what, input, output, common trap.
- Link to gene perturbation family.

Components:

- Search input.
- Filter chips.
- Method cards.
- Bookmark icon.
- Bottom navigation.

Interaction:

- Search filters methods locally or via API.
- Tap card to Method Detail.
- Tap question builder starts guided intake.

Android/PWA notes:

- Data should be driven by method library JSON.
- Cards must remain legible on 360 px width.

## 5. Frame 04: Gene Perturbation Family

Purpose:

- Explain CRISPR, RNAi, CRISPRi/a, Perturb-seq, overexpression, and screening differences.

Content:

- Family overview diagram with simple original icons.
- Comparison rows: purpose, duration, output, risk, common use.
- Beginner selector: 我想敲除 / 敲低 / 激活 / 筛选.
- Safety note about wet-lab and biosafety boundaries.

Components:

- Horizontal family tabs.
- Comparison table as stacked cards.
- Safety callout.
- Route button: 查看详细方法.

Interaction:

- Tap a family tab updates comparison.
- Selector recommends a method path.
- Detail button opens Method Detail.

Android/PWA notes:

- Use stacked cards instead of dense tables.
- Do not include wet-lab operational parameters.

## 6. Frame 05: Method Detail

Purpose:

- Give one method page that is readable on mobile and actionable later on desktop.

Content:

- Method title and one-sentence explanation.
- When to use.
- When not to use.
- Inputs needed.
- Outputs generated.
- Common mistakes.
- Example figure thumbnail using synthetic data.
- Next steps: save, compare, open desktop workflow.

Components:

- Header with bookmark.
- Accordion sections.
- Synthetic example image.
- Sticky action bar.

Interaction:

- Accordion expands sections.
- Save adds to My Library.
- Open desktop workflow creates a continuation task.

Android/PWA notes:

- Sticky action bar should avoid covering content.
- Example figures must use synthetic data only.

## 7. Frame 06: Writing Workshop

Purpose:

- Help users plan manuscripts and article workflows.

Content:

- Article type list: Meta分析, 综述, 机制研究, 单细胞文章, 预测模型, 病例系列.
- Progress ring for active draft.
- Button: 从0开始搭流程.
- Draft checklist: question, methods, figures, limitations, references.

Components:

- Article type cards.
- Progress indicators.
- Checklist items.
- Desk pet prompt.

Interaction:

- Tap article type opens its workflow.
- Tap checklist item opens lightweight drafting or reminder.
- Desk pet can ask clarifying questions.

Android/PWA notes:

- Mobile editing should focus on outline and notes, not full paper layout.
- Reference verification should route to desktop review when needed.

## 8. Frame 07: Meta Analysis Workflow

Purpose:

- Provide a clear mobile checklist for systematic review and Meta analysis.

Content:

- Stepper: PICO, protocol, search, screening, extraction, bias, synthesis, writing, submission check.
- Current step card.
- Required fields for PICO.
- Forest plot placeholder using synthetic example.
- Review warning about selective inclusion.

Components:

- Vertical stepper.
- Form fields.
- Status labels.
- Warning callout.

Interaction:

- Complete current step unlocks next suggested step.
- Save draft syncs to desktop.
- Tap forest plot placeholder opens Plot Assistant.

Android/PWA notes:

- Inputs should autosave.
- Use local draft cache for unreliable networks.

## 9. Frame 08: Plot Assistant

Purpose:

- Recommend chart types and record figure plans.

Content:

- Prompt: 我想回答什么问题.
- Choice grid: 比较, 趋势, 相关, 构成, 生存, 机制, 流程.
- Recommended chart list.
- Data format requirements.
- Button: 在桌面继续绘图.

Components:

- Large tap choices.
- Chart recommendation cards.
- Synthetic thumbnail previews.
- Export-to-desktop button.

Interaction:

- Tap question type updates chart recommendations.
- Tap chart opens requirements and examples.
- Continue button creates desktop task.

Android/PWA notes:

- Do not run heavy plotting on mobile first version.
- Prefer thumbnails and requirements over full chart editor.

## 10. Frame 09: Data Audit Summary

Purpose:

- Let users inspect data readiness without exposing sensitive fields.

Content:

- Audit status: ready, warning, blocked.
- Checklist: column names, missingness, duplicates, outliers, groups, leakage risk.
- Risk tags.
- Suggested next action.
- Privacy reminder.

Components:

- Status badge.
- Audit checklist.
- Risk tag chips.
- Action buttons: 查看详情, 回桌面处理.

Interaction:

- Tap checklist item expands explanation.
- Tap privacy reminder opens Governance and Safety.
- Desktop button opens continuation task.

Android/PWA notes:

- Never show raw identifiable patient fields in mobile previews.
- Use summaries and counts instead of full table views.

## 11. Frame 10: Pet Chat and My Settings

Purpose:

- Combine desk-pet guidance, saved work, API status, and safety controls.

Content:

- Pet chat quick intents: 找方法, 写文章, 画图, 数据审查, API配置, 安全边界, 游戏模式.
- Saved methods.
- Writing progress.
- Review logs.
- API configuration status without showing secrets.
- Safety and privacy settings.
- Island mode entry.

Components:

- Chat bubbles.
- Quick intent buttons.
- Saved item list.
- Settings rows.
- API status badge.
- Island mode button.

Interaction:

- Tap quick intent inserts script-driven prompt from `data/pet_dialogues.json`.
- Tap API status opens configuration guidance.
- Tap island mode opens Research Island.
- Tap review log opens read-only summary.

Android/PWA notes:

- API keys must never be displayed in full.
- Use secure server or local environment flow for credentials.
- Chat history involving sensitive research data should be deletable.

## 12. Figma Delivery Checklist

Each Figma frame should include:

- Frame name matching the sections above.
- Mobile width baseline: 390 x 844.
- Component labels for Android/PWA mapping.
- Notes for data source and route.
- Safety boundary annotation where relevant.
- No real school logo, hospital logo, or patient image.
- Original placeholder assets only.

Recommended component set:

- BottomTab.
- TopBar.
- TaskCard.
- MethodCard.
- SafetyCallout.
- PetButton.
- PetChatPanel.
- ProgressStepper.
- AuditStatusBadge.
- RouteActionButton.

## 13. Implementation Boundary

The mobile app may guide, summarize, remind, and continue tasks. It should not be the only place where final research outputs are created or approved.

Final manuscript text, statistical decisions, clinical wording, figure exports, and API key handling must retain review paths through the serious workbench and human oversight.
