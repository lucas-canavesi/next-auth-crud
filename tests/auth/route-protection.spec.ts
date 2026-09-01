import { test, expect } from '@playwright/test';

test.describe('Route Protection - Unauthenticated User', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('Access /dashboard without login redirects to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });

  test('Access /admin/users without login redirects to /login', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page).toHaveURL('/login');
  });

  test('Access /admin/users/new without login redirects to /login', async ({ page }) => {
    await page.goto('/admin/users/new');
    await expect(page).toHaveURL('/login');
  });

  test('Access /dashboard/profile without login redirects to /login', async ({ page }) => {
    await page.goto('/dashboard/profile');
    await expect(page).toHaveURL('/login');
  });
});