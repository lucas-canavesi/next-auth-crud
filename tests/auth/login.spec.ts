import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'tentativa@example.com';
const ADMIN_PASSWORD = '123456';
const USER_EMAIL = 'joao.admin@example.com';
const USER_PASSWORD = '123456';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing session
    await page.context().clearCookies();
    await page.goto('/login');
  });

  test('USER login - valid credentials', async ({ page }) => {
    await page.fill('input[name="email"]', USER_EMAIL);
    await page.fill('input[name="password"]', USER_PASSWORD);
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Check user name appears
    await expect(page.locator('text=Joao Admin Atualizado')).toBeVisible();

    // Check ADMIN menu is NOT visible for USER
    await expect(page.locator('text=Administração')).not.toBeVisible();
  });

  test('ADMIN login - valid credentials', async ({ page }) => {
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Check user name appears
    await expect(page.locator('text=Tentativa Indevida')).toBeVisible();

    // Check ADMIN menu IS visible for ADMIN
    await expect(page.locator('text=Administração')).toBeVisible();

    // Check ADMIN badge
    await expect(page.locator('text=ADMIN')).toBeVisible();
  });

  test('Login - invalid email', async ({ page }) => {
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');

    // Should stay on login page
    await expect(page).toHaveURL('/login');

    // Error message should appear
    await expect(page.locator('text=Email ou senha inválidos')).toBeVisible();
  });

  test('Login - invalid password', async ({ page }) => {
    await page.fill('input[name="email"]', USER_EMAIL);
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should stay on login page
    await expect(page).toHaveURL('/login');

    // Error message should appear
    await expect(page.locator('text=Email ou senha inválidos')).toBeVisible();
  });

  test('Login - empty fields', async ({ page }) => {
    await page.click('button[type="submit"]');

    // Should stay on login page
    await expect(page).toHaveURL('/login');

    // Validation errors should appear
    await expect(page.locator('text=Email é obrigatório')).toBeVisible();
    await expect(page.locator('text=Senha é obrigatória')).toBeVisible();
  });

  test('Login - invalid email format', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');

    // Should stay on login page
    await expect(page).toHaveURL('/login');

    // Validation error should appear
    await expect(page.locator('text=Email inválido')).toBeVisible();
  });
});