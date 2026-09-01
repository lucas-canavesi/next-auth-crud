import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'tentativa@example.com';
const ADMIN_PASSWORD = '123456';

test.describe('ADMIN Users List', () => {
  test.beforeEach(async ({ page }) => {
    // Login as ADMIN
    await page.goto('/login');
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('Access /admin/users - loads correctly', async ({ page }) => {
    await page.goto('/admin/users');

    // Page should load
    await expect(page.locator('h1:has-text("Usuários")')).toBeVisible();

    // Users table should be visible
    await expect(page.locator('table')).toBeVisible();

    // Check existing users appear
    await expect(page.locator('text=Tentativa Indevida')).toBeVisible();
    await expect(page.locator('text=tentativa@example.com')).toBeVisible();
    await expect(page.locator('text=Joao Admin Atualizado')).toBeVisible();
    await expect(page.locator('text=joao.admin@example.com')).toBeVisible();
  });

  test('Create new user button navigates to create page', async ({ page }) => {
    await page.goto('/admin/users');
    await page.click('text=+ Novo usuário');
    await expect(page).toHaveURL('/admin/users/new');
  });
});