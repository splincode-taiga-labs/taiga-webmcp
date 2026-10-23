import {expect, test} from '@playwright/test';

const TABLE_TOOLS = [
  'filterDemoEmployees',
  'selectDemoEmployee',
  'sortDemoEmployees',
  'paginateDemoEmployees',
  'readDemoEmployees',
];

test('Angular exposes the semantic table tools to the browser agent', async ({page}) => {
  await page.goto('/#/table-tools');

  await expect.poll(async () => (await page.webmcp.tools()).map((tool) => tool.name)).toEqual(
    expect.arrayContaining(TABLE_TOOLS),
  );

  const tools = await page.webmcp.tools();
  const sortTool = tools.find((tool) => tool.name === 'sortDemoEmployees');
  expect(sortTool?.inputSchema).toMatchObject({
    type: 'object',
    required: ['column', 'direction'],
  });

  const response = await page.webmcp.callTool('filterDemoEmployees', {query: 'Grace'});
  expect(response).toMatchObject({content: [{type: 'text', text: 'Filter updated'}]});
  await expect(page.locator('input[placeholder="Search by name or team"]')).toHaveValue('Grace');
  await expect(page.getByRole('cell', {name: 'Grace Hopper'})).toBeVisible();
  await expect(page.getByRole('cell', {name: 'Ada Lovelace'})).toHaveCount(0);

  const read = await page.webmcp.callTool('readDemoEmployees', {});
  expect(JSON.stringify(read)).toContain('Grace Hopper');
  expect(JSON.stringify(read)).not.toContain('Ada Lovelace');
});

test('sort and paginate via WebMCP update the same visible Taiga UI table', async ({page}) => {
  await page.goto('/#/table-tools');
  await expect.poll(async () => (await page.webmcp.tools()).length).toBeGreaterThanOrEqual(5);

  const sort = await page.webmcp.callTool('sortDemoEmployees', {
    column: 'name',
    direction: 'desc',
  });
  expect(JSON.stringify(sort)).toContain('Sorted by name (desc)');
  await expect(page.getByText('Sorted by: name (desc)')).toBeVisible();

  const result = await page.webmcp.callTool('paginateDemoEmployees', {page: 1, size: 2});
  expect(JSON.stringify(result)).toContain('Showing page 1');
  await expect(page.getByRole('cell', {name: 'Ada Lovelace'})).toBeVisible();
  await expect(page.getByRole('cell', {name: 'Margaret Hamilton'})).toHaveCount(0);

  const select = await page.webmcp.callTool('selectDemoEmployee', {id: 'emp-101'});
  expect(JSON.stringify(select)).toContain('Selected: Ada Lovelace');
  await expect(page.getByText('Selected: Ada Lovelace')).toBeVisible();
});

test('the browser API rejects invalid arguments without mutating UI state', async ({page}) => {
  await page.goto('/#/table-tools');
  await expect.poll(async () => (await page.webmcp.tools()).length).toBeGreaterThanOrEqual(5);

  try {
    const result = await page.webmcp.callTool('filterDemoEmployees', {
      query: 42,
    });
    expect(result).toMatchObject({isError: true});
  } catch {
    // Native JSON Schema validation may reject the call before Angular executes it.
  }

  await expect(page.locator('input[placeholder="Search by name or team"]')).toHaveValue('');
});

test('the Signal Forms tool registers only while its form is mounted', async ({page}) => {
  await page.goto('/#/table-tools');

  await expect.poll(async () => (await page.webmcp.tools()).map((tool) => tool.name)).not.toContain(
    'saveDemoEmployeeDraft',
  );

  await page.goto('/#/signal-forms');
  await expect.poll(async () => (await page.webmcp.tools()).map((tool) => tool.name)).toContain(
    'saveDemoEmployeeDraft',
  );

  const result = await page.webmcp.callTool('saveDemoEmployeeDraft', {
    fullName: 'Ada Lovelace',
    email: 'ada@example.com',
    team: 'Platform',
  });
  expect(JSON.stringify(result)).not.toContain('"isError":true');
  await expect(page.locator('.demo-result')).toContainText('ada@example.com');

  await page.goto('/#/table-tools');
  await expect.poll(async () => (await page.webmcp.tools()).map((tool) => tool.name)).not.toContain(
    'saveDemoEmployeeDraft',
  );
});
