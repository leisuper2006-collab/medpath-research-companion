import { test, expect } from '@playwright/test';

const routes = [
  '/',
  '/teacher',
  '/student',
  '/researcher',
  '/skill-builder',
  '/plugins',
  '/plugins/teaching',
  '/plugins/research',
  '/plugins/governance',
  '/skills/pathology-report-coach',
  '/simulate',
  '/simulate/new',
  '/simulate/demo-case-001',
  '/compare',
  '/evidence',
  '/open-source',
  '/plot-studio',
  '/method-runner',
  '/method-runner/virtual-perturbation',
  '/runtime',
  '/providers',
  '/governance',
  '/settings',
];

test('all required pages open without 404', async ({ page }) => {
  for (const route of routes) {
    await page.goto(`http://127.0.0.1:3000${route}`);
    await expect(page.locator('body')).toContainText('MedPath');
    await expect(page.locator('body')).not.toContainText('页面不存在');
  }
});

test('primary interactions work', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/teacher');
  await page.getByRole('button', { name: /生成病理 PBL 案例/ }).click();
  await expect(page.locator('#teacher-result')).toContainText('PBL');

  await page.goto('http://127.0.0.1:3000/simulate/new');
  await page.getByRole('button', { name: /生成案例/ }).click();
  await expect(page.locator('#sim-result')).toContainText('合成教学案例');

  await page.goto('http://127.0.0.1:3000/plot-studio');
  await page.getByRole('button', { name: /生成图/ }).click();
  await expect(page.locator('#plot-result svg')).toBeVisible();

  await page.goto('http://127.0.0.1:3000/skill-builder');
  await page.getByRole('button', { name: /生成 Skill 文件预览/ }).click();
  await expect(page.locator('#sb-result')).toContainText('SKILL.md');

  await page.goto('http://127.0.0.1:3000/providers');
  await page.getByRole('button', { name: /Test Connection/ }).first().click();
  await expect(page.locator('[id^="provider-"]').first()).toContainText(/mock|configured/);
});

