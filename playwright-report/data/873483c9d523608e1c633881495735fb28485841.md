# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth\login.spec.ts >> Login Flow >> ADMIN login - valid credentials
- Location: tests\auth\login.spec.ts:30:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Tentativa Indevida')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Tentativa Indevida')

```

```yaml
- heading "404" [level=1]
- heading "This page could not be found." [level=2]
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const ADMIN_EMAIL = 'tentativa@example.com';
  4  | const ADMIN_PASSWORD = '123456';
  5  | const USER_EMAIL = 'joao.admin@example.com';
  6  | const USER_PASSWORD = '123456';
  7  | 
  8  | test.describe('Login Flow', () => {
  9  |   test.beforeEach(async ({ page }) => {
  10 |     // Clear any existing session
  11 |     await page.context().clearCookies();
  12 |     await page.goto('/login');
  13 |   });
  14 | 
  15 |   test('USER login - valid credentials', async ({ page }) => {
  16 |     await page.fill('input[name="email"]', USER_EMAIL);
  17 |     await page.fill('input[name="password"]', USER_PASSWORD);
  18 |     await page.click('button[type="submit"]');
  19 | 
  20 |     // Should redirect to dashboard
  21 |     await expect(page).toHaveURL('/dashboard');
  22 | 
  23 |     // Check user name appears
  24 |     await expect(page.locator('text=Joao Admin Atualizado')).toBeVisible();
  25 | 
  26 |     // Check ADMIN menu is NOT visible for USER
  27 |     await expect(page.locator('text=Administração')).not.toBeVisible();
  28 |   });
  29 | 
  30 |   test('ADMIN login - valid credentials', async ({ page }) => {
  31 |     await page.fill('input[name="email"]', ADMIN_EMAIL);
  32 |     await page.fill('input[name="password"]', ADMIN_PASSWORD);
  33 |     await page.click('button[type="submit"]');
  34 | 
  35 |     // Should redirect to dashboard
  36 |     await expect(page).toHaveURL('/dashboard');
  37 | 
  38 |     // Check user name appears
> 39 |     await expect(page.locator('text=Tentativa Indevida')).toBeVisible();
     |                                                           ^ Error: expect(locator).toBeVisible() failed
  40 | 
  41 |     // Check ADMIN menu IS visible for ADMIN
  42 |     await expect(page.locator('text=Administração')).toBeVisible();
  43 | 
  44 |     // Check ADMIN badge
  45 |     await expect(page.locator('text=ADMIN')).toBeVisible();
  46 |   });
  47 | 
  48 |   test('Login - invalid email', async ({ page }) => {
  49 |     await page.fill('input[name="email"]', 'nonexistent@example.com');
  50 |     await page.fill('input[name="password"]', '123456');
  51 |     await page.click('button[type="submit"]');
  52 | 
  53 |     // Should stay on login page
  54 |     await expect(page).toHaveURL('/login');
  55 | 
  56 |     // Error message should appear
  57 |     await expect(page.locator('text=Email ou senha inválidos')).toBeVisible();
  58 |   });
  59 | 
  60 |   test('Login - invalid password', async ({ page }) => {
  61 |     await page.fill('input[name="email"]', USER_EMAIL);
  62 |     await page.fill('input[name="password"]', 'wrongpassword');
  63 |     await page.click('button[type="submit"]');
  64 | 
  65 |     // Should stay on login page
  66 |     await expect(page).toHaveURL('/login');
  67 | 
  68 |     // Error message should appear
  69 |     await expect(page.locator('text=Email ou senha inválidos')).toBeVisible();
  70 |   });
  71 | 
  72 |   test('Login - empty fields', async ({ page }) => {
  73 |     await page.click('button[type="submit"]');
  74 | 
  75 |     // Should stay on login page
  76 |     await expect(page).toHaveURL('/login');
  77 | 
  78 |     // Validation errors should appear
  79 |     await expect(page.locator('text=Email é obrigatório')).toBeVisible();
  80 |     await expect(page.locator('text=Senha é obrigatória')).toBeVisible();
  81 |   });
  82 | 
  83 |   test('Login - invalid email format', async ({ page }) => {
  84 |     await page.fill('input[name="email"]', 'invalid-email');
  85 |     await page.fill('input[name="password"]', '123456');
  86 |     await page.click('button[type="submit"]');
  87 | 
  88 |     // Should stay on login page
  89 |     await expect(page).toHaveURL('/login');
  90 | 
  91 |     // Validation error should appear
  92 |     await expect(page.locator('text=Email inválido')).toBeVisible();
  93 |   });
  94 | });
```