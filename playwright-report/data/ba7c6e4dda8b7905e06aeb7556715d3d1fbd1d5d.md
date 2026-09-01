# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: user\profile.spec.ts >> USER Profile Flow >> Edit profile - invalid email format
- Location: tests\user\profile.spec.ts:71:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="email"]')

```

# Page snapshot

```yaml
- generic [active] [ref=f2e1]:
  - generic [ref=f2e3]:
    - heading "404" [level=1] [ref=f2e4]
    - heading "This page could not be found." [level=2] [ref=f2e6]
  - button "Open Next.js Dev Tools" [ref=f2e12] [cursor=pointer]
  - alert [ref=f2e16]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const USER_EMAIL = 'joao.admin@example.com';
  4  | const USER_PASSWORD = '123456';
  5  | 
  6  | test.describe('USER Profile Flow', () => {
  7  |   test.beforeEach(async ({ page }) => {
  8  |     // Login as USER
  9  |     await page.goto('/login');
  10 |     await page.fill('input[name="email"]', USER_EMAIL);
  11 |     await page.fill('input[name="password"]', USER_PASSWORD);
  12 |     await page.click('button[type="submit"]');
  13 |     await expect(page).toHaveURL('/dashboard');
  14 |   });
  15 | 
  16 |   test('Access /dashboard/profile - loads correctly', async ({ page }) => {
  17 |     await page.goto('/dashboard/profile');
  18 | 
  19 |     // Page should load
  20 |     await expect(page.locator('h1:has-text("Meu Perfil")')).toBeVisible();
  21 | 
  22 |     // User info should be visible
  23 |     await expect(page.locator('text=Joao Admin Atualizado')).toBeVisible();
  24 |     await expect(page.locator('text=joao.admin@example.com')).toBeVisible();
  25 | 
  26 |     // Role badge should be visible
  27 |     await expect(page.locator('text=USER')).toBeVisible();
  28 |   });
  29 | 
  30 |   test('Edit profile - valid changes', async ({ page }) => {
  31 |     await page.goto('/dashboard/profile');
  32 | 
  33 |     // Change name
  34 |     await page.fill('input[name="name"]', 'Joao Atualizado E2E');
  35 |     await page.click('button:has-text("Salvar alterações")');
  36 | 
  37 |     // Success message should appear
  38 |     await expect(page.locator('text=Perfil atualizado com sucesso')).toBeVisible();
  39 | 
  40 |     // Name should be updated in header (may need to wait for refresh)
  41 |     await page.waitForTimeout(1000);
  42 |     await expect(page.locator('text=Joao Atualizado E2E')).toBeVisible();
  43 | 
  44 |     // Verify data persisted by reloading
  45 |     await page.reload();
  46 |     await expect(page.locator('input[name="name"]')).toHaveValue('Joao Atualizado E2E');
  47 |   });
  48 | 
  49 |   test('Edit profile - invalid name (empty)', async ({ page }) => {
  50 |     await page.goto('/dashboard/profile');
  51 | 
  52 |     // Clear name
  53 |     await page.fill('input[name="name"]', '');
  54 |     await page.click('button:has-text("Salvar alterações")');
  55 | 
  56 |     // Error should appear
  57 |     await expect(page.locator('text=Nome é obrigatório')).toBeVisible();
  58 |   });
  59 | 
  60 |   test('Edit profile - invalid name (too short)', async ({ page }) => {
  61 |     await page.goto('/dashboard/profile');
  62 | 
  63 |     // Name too short
  64 |     await page.fill('input[name="name"]', 'J');
  65 |     await page.click('button:has-text("Salvar alterações")');
  66 | 
  67 |     // Error should appear
  68 |     await expect(page.locator('text=Nome deve ter pelo menos 2 caracteres')).toBeVisible();
  69 |   });
  70 | 
  71 |   test('Edit profile - invalid email format', async ({ page }) => {
  72 |     await page.goto('/dashboard/profile');
  73 | 
  74 |     // Invalid email
> 75 |     await page.fill('input[name="email"]', 'invalid-email');
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  76 |     await page.click('button:has-text("Salvar alterações")');
  77 | 
  78 |     // Error should appear
  79 |     await expect(page.locator('text=Email inválido')).toBeVisible();
  80 |   });
  81 | 
  82 |   test('Edit profile - duplicate email', async ({ page }) => {
  83 |     await page.goto('/dashboard/profile');
  84 | 
  85 |     // Try to use existing email (tentativa@example.com - ADMIN)
  86 |     await page.fill('input[name="email"]', 'tentativa@example.com');
  87 |     await page.click('button:has-text("Salvar alterações")');
  88 | 
  89 |     // Error should appear
  90 |     await expect(page.locator('text=Este email já está cadastrado')).toBeVisible();
  91 |   });
  92 | });
```