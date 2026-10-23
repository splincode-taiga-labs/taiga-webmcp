import {expect, test} from '@playwright/test';

test('API and Setup tabs support clicks, deep links and browser history', async ({page}) => {
  await page.goto('/#/webmcp');

  await expect(page.getByRole('heading', {name: 'WebMCP'})).toBeVisible();

  await page.getByRole('link', {name: 'API', exact: true}).click();
  await expect(page).toHaveURL(/\/#\/webmcp\/API$/);
  await expect(page.getByRole('heading', {name: 'Tool helpers'})).toBeVisible();

  await page.getByRole('link', {name: 'Setup', exact: true}).click();
  await expect(page).toHaveURL(/\/#\/webmcp\/Setup$/);
  await expect(page.getByRole('heading', {name: 'Browser and security'})).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/#\/webmcp\/API$/);
  await expect(page.getByRole('heading', {name: 'Tool helpers'})).toBeVisible();

  await page.goForward();
  await expect(page.getByRole('heading', {name: 'Browser and security'})).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', {name: 'Browser and security'})).toBeVisible();

  await page.getByRole('link', {name: 'Examples', exact: true}).click();
  await expect(page).toHaveURL(/\/#\/webmcp$/);
  await expect(page.getByRole('heading', {name: 'Employees · Search, sorting, pagination and selection'})).toBeVisible();
});

test('sidebar examples open their own pages', async ({page}) => {
  await page.goto('/#/webmcp');

  const navigation = page.locator('tui-doc-navigation');
  await navigation.getByRole('link', {name: 'Table tools', exact: true}).click();
  await expect(page).toHaveURL(/\/#\/table-tools$/);
  await expect(page.getByRole('heading', {name: 'Interactive employee table'})).toBeVisible();

  await navigation.getByRole('link', {name: 'Signal Forms', exact: true}).click();
  await expect(page).toHaveURL(/\/#\/signal-forms$/);
  await expect(page.getByRole('heading', {name: 'Validated employee draft'})).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', {name: 'Validated employee draft'})).toBeVisible();
});

test('the built demo serves its logo and Taiga UI icons', async ({page, request}) => {
  await page.goto('/#/webmcp');

  const logo = page.locator('header .t-logo img');
  await expect(logo).toBeVisible();
  await expect.poll(() => logo.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);

  for (const path of ['/assets/taiga-ui/icons/search.svg', '/assets/taiga-ui/icons/chevron-down.svg']) {
    const response = await request.get(path);
    expect(response.ok(), path).toBe(true);
    expect(await response.text()).toContain('<svg');
  }
});

test('long JSON output stays inside its table tool panel', async ({page}) => {
  await page.goto('/#/table-tools');

  await page.getByRole('button', {name: 'Read current table state'}).click();
  const result = page.locator('.demo-result');
  await expect(result).toContainText('employees');

  const panel = result.locator('xpath=ancestor::section[contains(@class, "demo-panel")]');
  const resultRect = await result.boundingBox();
  const panelRect = await panel.boundingBox();
  expect(resultRect).not.toBeNull();
  expect(panelRect).not.toBeNull();

  if (resultRect && panelRect) {
    expect(resultRect.x + resultRect.width).toBeLessThanOrEqual(panelRect.x + panelRect.width + 1);
  }
});

test('examples use a single column at mobile width', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/#/table-tools');

  const panels = page.locator('.demo-layout > .demo-panel');
  await expect(panels).toHaveCount(2);
  const first = await panels.nth(0).boundingBox();
  const second = await panels.nth(1).boundingBox();
  expect(first).not.toBeNull();
  expect(second).not.toBeNull();

  if (first && second) {
    expect(second.y).toBeGreaterThanOrEqual(first.y + first.height);
  }
});
