import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'tentativa@example.com';
const ADMIN_PASSWORD = '123456';

test.describe('ADMIN Delete User', () => {
  test.beforeEach(async ({ page }) => {
    // Login as ADMIN
    await page.goto('/login');
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('Delete user - confirm deletion', async ({ page }) => {
    await page.goto('/admin/users');

    // Get initial user count
    const initialRows = await page.locator('tbody tr').count();

    // Click delete on the test user (not the current admin)
    await page.locator('tr:has-text("Joao Admin Atualizado")').locator('button:has-text("Excluir")').click();

    // Dialog should appear
    await expect(page.locator('h2:has-text("Excluir usuário?")')).toBeVisible();

    // Cancel should close dialog
    await page.click('button:has-text("Cancelar")');
    await expect(page.locator('h2:has-text("Excluir usuário?")')).not.toBeVisible();

    // Click delete again
    await page.locator('tr:has-text("Joao Admin Atualizado")').locator('button:has-text("Excluir")').click();

    // Confirm deletion
    await page.click('button:has-text("Excluir"):not(:has-text("Cancelar"))');

    // User should be removed from list
    await expect(page.locator('text=Joao Admin Atualizado')).not.toBeVisible();

    // Row count should decrease
    const finalRows = await page.locator('tbody tr').count();
    expect(finalRows).toBe(initialRows - 1);
  });

  test('Delete user - Escape key closes dialog', async ({ page }) => {
    await page.goto('/admin/users');

    // Click delete
    await page.locator('tr:has-text("Joao Admin Atualizado")').locator('button:has-text("Excluir")').click();

    // Dialog should appear
    await expect(page.locator('h2:has-text("Excluir usuário?")')).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Dialog should close
    await expect(page.locator('h2:has-text("Excluir usuário?")')).not.toBeVisible();
  });

  test('Delete user - clicking overlay closes dialog', async ({ page }) => {
    await page.goto('/admin/users');

    // Click delete
    await page.locator('tr:has-text("Joao Admin Atualizado")').locator('button:has-text("Excluir")').click();

    // Dialog should appear
    await expect(page.locator('h2:has-text("Excluir usuário?")')).toBeVisible();

    // Click overlay (background)
    await page.locator('.fixed.inset-0.bg-black\\/50').click();

    // Dialog should close
    await expect(page.locator('h2:has-text("Excluir usuário?")')).not.toBeVisible();
  });
});