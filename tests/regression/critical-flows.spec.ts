import { test, expect } from '@playwright/test';

const USER_EMAIL = 'joao.admin@example.com';
const USER_PASSWORD = '123456';
const ADMIN_EMAIL = 'tentativa@example.com';
const ADMIN_PASSWORD = '123456';

test.describe('Regression - Critical Flows', () => {
  test.describe('FASE 7: /api/login returns user.role', () => {
    test('USER login returns role in response', async ({ page }) => {
      const response = await page.request.post('/api/login', {
        data: { email: USER_EMAIL, password: USER_PASSWORD },
      });
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.user.role).toBe('USER');
    });

    test('ADMIN login returns role in response', async ({ page }) => {
      const response = await page.request.post('/api/login', {
        data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
      });
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.user.role).toBe('ADMIN');
    });
  });

  test.describe('FASE 7: ADMIN gets privileges immediately after login', () => {
    test('ADMIN sees admin menu immediately after login without refresh', async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', ADMIN_EMAIL);
      await page.fill('input[name="password"]', ADMIN_PASSWORD);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL('/dashboard');

      // Admin menu should be visible immediately
      await expect(page.locator('text=Administração')).toBeVisible();

      // Navigate to admin users - should work without manual refresh
      await page.goto('/admin/users');
      await expect(page.locator('h1:has-text("Usuários")')).toBeVisible();
    });
  });

  test.describe('FASE 8: Accessibility - Keyboard Navigation', () => {
    test('Login form - Tab navigation', async ({ page }) => {
      await page.goto('/login');

      // Tab to email
      await page.keyboard.press('Tab');
      await expect(page.locator('input[name="email"]')).toBeFocused();

      // Tab to password
      await page.keyboard.press('Tab');
      await expect(page.locator('input[name="password"]')).toBeFocused();

      // Tab to submit
      await page.keyboard.press('Tab');
      await expect(page.locator('button[type="submit"]')).toBeFocused();
    });

    test('Delete dialog - Escape closes dialog', async ({ page }) => {
      // Login as ADMIN
      await page.goto('/login');
      await page.fill('input[name="email"]', ADMIN_EMAIL);
      await page.fill('input[name="password"]', ADMIN_PASSWORD);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL('/dashboard');

      await page.goto('/admin/users');
      await page.locator('tr:has-text("Joao Admin Atualizado")').locator('button:has-text("Excluir")').click();

      await expect(page.locator('h2:has-text("Excluir usuário?")')).toBeVisible();

      // Escape should close
      await page.keyboard.press('Escape');
      await expect(page.locator('h2:has-text("Excluir usuário?")')).not.toBeVisible();
    });
  });

  test.describe('FASE 8: Focus Management', () => {
    test('Delete dialog - focus on cancel button when opened', async ({ page }) => {
      // Login as ADMIN
      await page.goto('/login');
      await page.fill('input[name="email"]', ADMIN_EMAIL);
      await page.fill('input[name="password"]', ADMIN_PASSWORD);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL('/dashboard');

      await page.goto('/admin/users');
      await page.locator('tr:has-text("Joao Admin Atualizado")').locator('button:has-text("Excluir")').click();

      // Cancel button should be focused
      await expect(page.locator('button:has-text("Cancelar")')).toBeFocused();
    });
  });
});