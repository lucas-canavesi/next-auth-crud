import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'tentativa@example.com';
const ADMIN_PASSWORD = '123456';

test.describe('ADMIN Create User', () => {
  test.beforeEach(async ({ page }) => {
    // Login as ADMIN
    await page.goto('/login');
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('Create user - valid data', async ({ page }) => {
    await page.goto('/admin/users/new');

    // Page should load
    await expect(page.locator('h1:has-text("Novo Usuário")')).toBeVisible();

    // Fill form
    await page.fill('input[name="name"]', 'E2E Test User');
    await page.fill('input[name="email"]', 'e2e.user@example.com');
    await page.fill('input[name="password"]', '12345678');

    // Submit
    await page.click('button:has-text("Criar usuário")');

    // Should redirect to users list
    await expect(page).toHaveURL('/admin/users');

    // New user should appear in list
    await expect(page.locator('text=E2E Test User')).toBeVisible();
    await expect(page.locator('text=e2e.user@example.com')).toBeVisible();
  });

  test('Create user - empty name', async ({ page }) => {
    await page.goto('/admin/users/new');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', '12345678');
    await page.click('button:has-text("Criar usuário")');

    // Error should appear
    await expect(page.locator('text=Nome é obrigatório')).toBeVisible();
  });

  test('Create user - name too short', async ({ page }) => {
    await page.goto('/admin/users/new');

    await page.fill('input[name="name"]', 'J');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', '12345678');
    await page.click('button:has-text("Criar usuário")');

    // Error should appear
    await expect(page.locator('text=Nome deve ter pelo menos 2 caracteres')).toBeVisible();
  });

  test('Create user - invalid email', async ({ page }) => {
    await page.goto('/admin/users/new');

    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', '12345678');
    await page.click('button:has-text("Criar usuário")');

    // Error should appear
    await expect(page.locator('text=Email inválido')).toBeVisible();
  });

  test('Create user - password too short', async ({ page }) => {
    await page.goto('/admin/users/new');

    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', '123');
    await page.click('button:has-text("Criar usuário")');

    // Error should appear
    await expect(page.locator('text=Senha deve ter pelo menos 6 caracteres')).toBeVisible();
  });

  test('Create user - duplicate email', async ({ page }) => {
    await page.goto('/admin/users/new');

    // Use existing email
    await page.fill('input[name="name"]', 'Another User');
    await page.fill('input[name="email"]', 'tentativa@example.com');
    await page.fill('input[name="password"]', '12345678');
    await page.click('button:has-text("Criar usuário")');

    // Error should appear
    await expect(page.locator('text=Este email já está cadastrado')).toBeVisible();
  });
});