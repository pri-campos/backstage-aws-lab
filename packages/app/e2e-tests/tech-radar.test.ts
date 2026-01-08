import { test, expect, type Page } from '@playwright/test';

async function unlockWelcomeIfPresent(page: Page) {
  const enterButton = page.getByRole('button', { name: 'Enter' });
  if (await enterButton.isVisible().catch(() => false)) {
    await enterButton.click();
  }
}

test('Sidebar should expose Tech Radar menu', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await unlockWelcomeIfPresent(page);

  const techRadarMenu = page.getByRole('link', { name: 'Tech Radar' });
  await expect(techRadarMenu).toBeVisible();
  await expect(techRadarMenu).toHaveAttribute('href', '/tech-radar');
});

test('Tech Radar should load successfully', async ({ page }) => {
  await page.goto('/tech-radar', { waitUntil: 'domcontentloaded' });
  await unlockWelcomeIfPresent(page);

  if (!/\/tech-radar/.test(page.url())) {
    await page.goto('/tech-radar', { waitUntil: 'domcontentloaded' });
  }

  await expect(page).toHaveURL(/\/tech-radar/);

  const quadrants = page.getByTestId('radar-quadrant');
  await expect(quadrants).toHaveCount(4);

  for (const title of ['Languages', 'Frameworks', 'Process', 'Infrastructure']) {
    await expect(quadrants.getByRole('heading', { name: title })).toHaveCount(1);
  }
});
