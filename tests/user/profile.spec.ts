import { test, expect } from '@playwright/test';

const USER_EMAIL = 'joao.admin@example.com';
const USER_PASSWORD = '123456';

test.describe('USER Profile Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as USER
    await page.goto('/login');
    await page.fill('input[name="email"]', USER_EMAIL);
    await page.fill('input[name="password"]', USER_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('Access /dashboard/profile - loads correctly', async ({ page }) => {
    await page.goto('/dashboard/profile');

    // Page should load
    await expect(page.locator('h1:has-text("Meu Perfil")')).toBeVisible();

    // User info should be visible
    await expect(page.locator('text=Joao Admin Atualizado')).toBeVisible();
    await expect(page.locator('text=joao.admin@example.com')).toBeVisible();

    // Role badge should be visible
    await expect(page.locator('text=USER')).toBeVisible();
  });

  test('Edit profile - valid changes', async ({ page }) => {
    await page.goto('/dashboard/profile');

    // Change name
    await page.fill('input[name="name"]', 'Joao Atualizado E2E');
    await page.click('button:has-text("Salvar alterações")');

    // Success message should appear
    await expect(page.locator('text=Perfil atualizado com sucesso')).toBeVisible();

    // Name should be updated in header (may need to wait for refresh)
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Joao Atualizado E2E')).toBeVisible();

    // Verify data persisted by reloading
    await page.reload();
    await expect(page.locator('input[name="name"]')).toHaveValue('Joao Atualizado E2E');
  });

  test('Edit profile - invalid name (empty)', async ({ page }) => {
    await page.goto('/dashboard/profile');

    // Clear name
    await page.fill('input[name="name"]', '');
    await page.click('button:has-text("Salvar alterações")');

    // Error should appear
    await expect(page.locator('text=Nome é obrigatório')).toBeVisible();
  });

  test('Edit profile - invalid name (too short)', async ({ page }) => {
    await page.goto('/dashboard/profile');

    // Name too short
    await page.fill('input[name="name"]', 'J');
    await page.click('button:has-text("Salvar alterações")');

    // Error should appear
    await expect(page.locator('text=Nome deve ter pelo menos 2 caracteres')).toBeVisible();
  });

  test('Edit profile - invalid email format', async ({ page }) => {
    await page.goto('/dashboard/profile');

    // Invalid email
    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('button:has-text("Salvar alterações")');

    // Error should appear
    await expect(page.locator('text=Email inválido')).toBeVisible();
  });

  test('Edit profile - duplicate email', async ({ page }) => {
    await page.goto('/dashboard/profile');

    // Try to use existing email (tentativa@example.com - ADMIN)
    await page.fill('input[name="email"]', 'tentativa@example.com');
    await page.click('button:has-text("Salvar alterações")');

    // Error should appear
    await expect(page.locator('text=Este email já está cadastrado')).toBeVisible();
  });
});