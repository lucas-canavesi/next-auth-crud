import { test, expect } from '@playwright/test';

const USER_EMAIL = 'joao.admin@example.com';
const USER_PASSWORD = '123456';

test.describe('Logout Flow', () => {
  test('USER logout', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', USER_EMAIL);
    await page.fill('input[name="password"]', USER_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');

    // Click logout
    await page.click('button:has-text("Sair")');

    // Should redirect to login
    await expect(page).toHaveURL('/login');

    // Try to access protected page - should redirect to login
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');

    // Try to access admin page - should redirect to login
    await page.goto('/admin/users');
    await expect(page).toHaveURL('/login');
  });
});