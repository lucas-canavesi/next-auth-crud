import { test, expect } from '@playwright/test';

const USER_EMAIL = 'joao.admin@example.com';
const USER_PASSWORD = '123456';

test.describe('Backend Authorization - USER blocked from ADMIN APIs', () => {
  test('GET /api/users returns 403 for USER', async ({ page }) => {
    // Login as USER
    await page.goto('/login');
    await page.fill('input[name="email"]', USER_EMAIL);
    await page.fill('input[name="password"]', USER_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');

    // Direct API call
    const response = await page.request.get('/api/users');
    expect(response.status()).toBe(403);
  });

  test('POST /api/users returns 403 for USER', async ({ page }) => {
    // Login as USER
    await page.goto('/login');
    await page.fill('input[name="email"]', USER_EMAIL);
    await page.fill('input[name="password"]', USER_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');

    // Direct API call
    const response = await page.request.post('/api/users', {
      data: { name: 'Test', email: 'test@example.com', password: '123456' },
    });
    expect(response.status()).toBe(403);
  });

  test('DELETE /api/users/:id returns 403 for USER', async ({ page }) => {
    // Login as USER
    await page.goto('/login');
    await page.fill('input[name="email"]', USER_EMAIL);
    await page.fill('input[name="password"]', USER_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');

    // Direct API call
    const response = await page.request.delete('/api/users/1');
    expect(response.status()).toBe(403);
  });

  test('PUT /api/users/:id returns 403 for USER', async ({ page }) => {
    // Login as USER
    await page.goto('/login');
    await page.fill('input[name="email"]', USER_EMAIL);
    await page.fill('input[name="password"]', USER_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');

    // Direct API call
    const response = await page.request.put('/api/users/1', {
      data: { name: 'Test' },
    });
    expect(response.status()).toBe(403);
  });
});