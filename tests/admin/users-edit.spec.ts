import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'tentativa@example.com';
const ADMIN_PASSWORD = '123456';

test.describe('ADMIN Edit User', () => {
  test.beforeEach(async ({ page }) => {
    // Login as ADMIN
    await page.goto('/login');
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('Edit user - valid changes', async ({ page }) => {
    await page.goto('/admin/users');

    // Click edit on the test user
    await page.locator('tr:has-text("Joao Admin Atualizado")').locator('a:has-text("Editar")').click();

    // Should navigate to edit page
    await expect(page).toHaveURL(/\/admin\/users\/\d+\/edit/);

    // Form should have current data
    await expect(page.locator('input[name="name"]')).toHaveValue('Joao Admin Atualizado');
    await expect(page.locator('input[name="email"]')).toHaveValue('joao.admin@example.com');

    // Update name
    await page.fill('input[name="name"]', 'Joao Editado E2E');
    await page.click('button:has-text("Salvar alterações")');

    // Should redirect to users list
    await expect(page).toHaveURL('/admin/users');

    // Updated name should appear
    await expect(page.locator('text=Joao Editado E2E')).toBeVisible();
  });

  test('Edit user - empty name', async ({ page }) => {
    await page.goto('/admin/users');
    await page.locator('tr:has-text("Joao Admin Atualizado")').locator('a:has-text("Editar")').click();

    await page.fill('input[name="name"]', '');
    await page.click('button:has-text("Salvar alterações")');

    // Error should appear
    await expect(page.locator('text=Nome é obrigatório')).toBeVisible();
  });

  test('Edit user - duplicate email', async ({ page }) => {
    await page.goto('/admin/users');
    await page.locator('tr:has-text("Joao Admin Atualizado")').locator('a:has-text("Editar")').click();

    await page.fill('input[name="email"]', 'tentativa@example.com');
    await page.click('button:has-text("Salvar alterações")');

    // Error should appear
    await expect(page.locator('text=Este email já está cadastrado')).toBeVisible();
  });

  test('Edit user - non-existent user', async ({ page }) => {
    await page.goto('/admin/users/99999/edit');

    // Should redirect to users list with error
    await expect(page).toHaveURL('/admin/users');
    await expect(page.locator('text=Usuário não encontrado')).toBeVisible();
  });
});