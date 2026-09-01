import { test, expect } from '@playwright/test';

const USER_EMAIL = 'joao.admin@example.com';
const USER_PASSWORD = '123456';

test.describe('Frontend Authorization - USER blocked from ADMIN routes', () => {
  test.beforeEach(async ({ page }) => {
    // Login as USER
    await page.goto('/login');
    await page.fill('input[name="email"]', USER_EMAIL);
    await page.fill('input[name="password"]', USER_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('USER accessing /admin/users redirects to /dashboard', async ({ page }) => {
    await page.goto('/admin/users');
    // Should be redirected to dashboard (or login) by AdminGuard
    await expect(page).toHaveURL('/dashboard');
  });

  test('USER accessing /admin/users/new redirects to /dashboard', async ({ page }) => {
    await page.goto('/admin/users/new');
    await expect(page).toHaveURL('/dashboard');
  });

  test('USER accessing /admin/users/1/edit redirects to /dashboard', async ({ page }) => {
    await page.goto('/admin/users/1/edit');
    await expect(page).toHaveURL('/dashboard');
  });

  test('USER does not see Administração menu', async ({ page }) => {
    await expect(page.locator('text=Administração')).not.toBeVisible();
  });
});